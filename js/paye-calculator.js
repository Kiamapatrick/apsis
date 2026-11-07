/* APSIS PAYE calculator: standard payslip (monthly, resident employee).
   All rates live in RATES. When the law changes, edit RATES and checkedOn only. */
(function () {
  "use strict";

  var RATES = {
    checkedOn: "7 November 2026",
    // Upper edge of each band (monthly taxable pay, KES). KRA PAYE guide 2025/26.
    bands: [
      { upTo: 24000, rate: 0.10 },
      { upTo: 32333, rate: 0.25 },
      { upTo: 500000, rate: 0.30 },
      { upTo: 800000, rate: 0.325 },
      { upTo: Infinity, rate: 0.35 }
    ],
    personalRelief: 2400,
    nssf: { rate: 0.06, upperLimit: 108000 }, // Year 4, from February 2026
    shif: { rate: 0.0275, minimum: 300 },     // Social Health Insurance Regulations 2024
    housingLevy: { rate: 0.015 },              // employee share
    nita: 50                                   // NITA training levy per employee per month (NITA Levy Inspectorate page)
  };

  var MAX_GROSS = 1000000000;

  function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }

  function taxOnTaxable(taxable) {
    var lower = 0, taxBefore = 0, bands = [];
    RATES.bands.forEach(function (b) {
      var amount = Math.max(0, Math.min(taxable, b.upTo) - lower);
      var tax = amount * b.rate;
      bands.push({ from: lower, to: b.upTo, rate: b.rate, amount: amount, tax: tax });
      taxBefore += tax;
      lower = b.upTo;
    });
    taxBefore = round2(taxBefore);
    return { taxBefore: taxBefore, bands: bands };
  }

  function compute(gross, options) {
    options = options || {};
    var extraPension = options.extraPension || 0;
    var prmf = options.prmf || 0;
    var mortgageInterest = options.mortgageInterest || 0;
    var insurancePremium = options.insurancePremium || 0;

    var nssf = round2(RATES.nssf.rate * Math.min(gross, RATES.nssf.upperLimit));
    var shif = round2(Math.max(RATES.shif.minimum, RATES.shif.rate * gross));
    var levy = round2(RATES.housingLevy.rate * gross);

    // Pension deduction = min(NSSF + extraPension, 30000)
    var pensionDeduction = Math.min(nssf + extraPension, 30000);
    // PRMF deduction = min(prmf, 15000)
    var prmfDeduction = Math.min(prmf, 15000);
    // Mortgage interest deduction = min(mortgageInterest, 30000)
    var mortgageDeduction = Math.min(mortgageInterest, 30000);

    var taxable = Math.max(0, round2(gross - pensionDeduction - prmfDeduction - mortgageDeduction - shif - levy));

    var taxResult = taxOnTaxable(taxable);
    var taxBefore = taxResult.taxBefore;
    var bands = taxResult.bands;

    // Insurance relief = min(0.15 * insurancePremium, 5000)
    var insuranceRelief = Math.min(round2(0.15 * insurancePremium), 5000);
    var paye = Math.max(0, round2(taxBefore - RATES.personalRelief - insuranceRelief));
    // Net pay = gross - NSSF - SHIF - levy - PAYE - extraPension - prmf
    // Mortgage interest and insurance premiums are paid outside payroll
    var net = round2(gross - nssf - shif - levy - paye - extraPension - prmf);

    return { gross: gross, nssf: nssf, shif: shif, levy: levy, taxable: taxable,
             bands: bands, taxBefore: taxBefore, relief: RATES.personalRelief,
             insuranceRelief: insuranceRelief,
             paye: paye, net: net,
             pensionDeduction: pensionDeduction, prmfDeduction: prmfDeduction,
             mortgageDeduction: mortgageDeduction, extraPension: extraPension, prmf: prmf };
  }

  function grossFromNet(net, options) {
    if (net <= 0) return 0;
    var low = 0;
    var high = net * 2 + 10000;
    for (var i = 0; i < 100; i++) {
      var mid = (low + high) / 2;
      var r = compute(mid, options);
      if (r.net >= net) {
        high = mid;
      } else {
        low = mid;
      }
    }
    return round2(high);
  }

  function employerCost(gross) {
    var empNssf = round2(RATES.nssf.rate * Math.min(gross, RATES.nssf.upperLimit));
    var empLevy = round2(RATES.housingLevy.rate * gross);
    var nita = RATES.nita;
    var total = round2(gross + empNssf + empLevy + nita);
    return { gross: gross, employerNssf: empNssf, employerLevy: empLevy, nita: nita, total: total };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { compute: compute, taxOnTaxable: taxOnTaxable, grossFromNet: grossFromNet, employerCost: employerCost, RATES: RATES };
    return;
  }

  /* ---------- Page wiring ---------- */
  var fmt = new Intl.NumberFormat("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var fmtInt = new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 });
  function money(n) { return fmt.format(n); }

  var input = document.getElementById("pcGross");
  var errorEl = document.getElementById("pcError");
  var emptyEl = document.getElementById("pcEmpty");
  var resultEl = document.getElementById("pcResult");
  var bandBody = document.getElementById("pcBandRows");
  var checkedEls = document.querySelectorAll("[data-checked-on]");
  var grossLabel = document.getElementById("pcGrossLabel");
  var netHint = document.getElementById("pcNetHint");
  var modeRadios = document.querySelectorAll('input[name="mode"]');
  var extraPensionEl = document.getElementById("pcExtraPension");
  var prmfEl = document.getElementById("pcPrmf");
  var mortgageEl = document.getElementById("pcMortgage");
  var insuranceEl = document.getElementById("pcInsurance");
  var printBtn = document.getElementById("pcPrintBtn");
  var printDateEl = document.getElementById("pcPrintDate");

  checkedEls.forEach(function (el) { el.textContent = RATES.checkedOn; });

  function set(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function parseInput(text) {
    var cleaned = String(text).replace(/[,\s]/g, "");
    if (cleaned === "") return { empty: true };
    if (!/^\d*\.?\d+$|^\d+\.$/.test(cleaned)) return { error: "Enter numbers only, for example 85000." };
    var n = parseFloat(cleaned);
    if (n === 0) return { empty: true };
    if (n > MAX_GROSS) return { error: "Enter an amount below KES 1,000,000,000." };
    return { value: n };
  }

  function parseOptional(text, fieldName) {
    var cleaned = String(text).replace(/[,\s]/g, "");
    if (cleaned === "") return { value: 0 };
    if (!/^\d*\.?\d+$|^\d+\.$/.test(cleaned)) return { error: fieldName + " must be a number." };
    var n = parseFloat(cleaned);
    if (n < 0) return { error: fieldName + " must be 0 or more." };
    return { value: n };
  }

  function getMode() {
    for (var i = 0; i < modeRadios.length; i++) {
      if (modeRadios[i].checked) return modeRadios[i].value;
    }
    return "gross";
  }

  function updateModeUI(mode) {
    if (mode === "net") {
      grossLabel.textContent = "Monthly take-home pay (KES)";
      input.placeholder = "For example 50,000";
      netHint.hidden = false;
    } else {
      grossLabel.textContent = "Monthly gross pay (KES)";
      input.placeholder = "For example 85,000";
      netHint.hidden = true;
    }
  }

  function bandLabel(b, i) {
    if (i === 0) return "First " + fmtInt.format(b.to);
    if (b.to === Infinity) return "Above " + fmtInt.format(b.from);
    return fmtInt.format(b.from + 1) + " to " + fmtInt.format(b.to);
  }

  function renderBands(bands) {
    bandBody.innerHTML = "";
    bands.forEach(function (b, i) {
      var tr = document.createElement("tr");
      if (b.amount === 0) tr.className = "pc-muted-row";
      var cells = [
        bandLabel(b, i),
        (b.rate * 100).toString().replace(/\.0+$/, "") + "%",
        money(b.amount),
        money(b.tax)
      ];
      cells.forEach(function (text, j) {
        var td = document.createElement("td");
        td.textContent = text;
        if (j > 0) td.className = "pc-num";
        tr.appendChild(td);
      });
      bandBody.appendChild(tr);
    });
  }

  function renderExtraRows(r) {
    // Extra deduction rows in payslip
    var payslipBody = document.querySelector(".pc-payslip tbody");
    var existingExtra = payslipBody.querySelectorAll(".pc-extra-row");
    existingExtra.forEach(function (row) { row.remove(); });

    var extraRows = [];
    if (r.extraPension > 0) {
      extraRows.push({ label: "Extra pension contributions", value: r.extraPension });
    }
    if (r.prmf > 0) {
      extraRows.push({ label: "Post-retirement medical fund", value: r.prmf });
    }
    // Note: mortgage interest and insurance premiums are NOT shown in payslip (paid outside payroll)

    var payeRow = document.getElementById("pcPaye").closest("tr");
    extraRows.forEach(function (row) {
      var tr = document.createElement("tr");
      tr.className = "pc-extra-row";
      var th = document.createElement("th");
      th.scope = "row";
      th.textContent = row.label;
      var td = document.createElement("td");
      td.className = "pc-num";
      td.textContent = money(row.value);
      tr.appendChild(th);
      tr.appendChild(td);
      payslipBody.insertBefore(tr, payeRow);
    });

    // Working section: extra deductions and insurance relief
    var stepsBody = document.querySelector(".pc-steps:last-of-type tbody");
    var existingWorkExtra = stepsBody.querySelectorAll(".pc-extra-row");
    existingWorkExtra.forEach(function (row) { row.remove(); });

    var workRows = [];
    if (r.extraPension > 0) {
      workRows.push({ label: "Less extra pension contributions", value: r.extraPension });
    }
    if (r.prmf > 0) {
      workRows.push({ label: "Less post-retirement medical fund", value: r.prmf });
    }
    if (r.mortgageDeduction > 0) {
      workRows.push({ label: "Less mortgage interest deduction", value: r.mortgageDeduction });
    }
    if (r.insuranceRelief > 0) {
      workRows.push({ label: "Less insurance relief", value: r.insuranceRelief, isRelief: true });
    }

    var payeWorkRow = document.getElementById("pcWPaye").closest("tr");
    workRows.forEach(function (row) {
      var tr = document.createElement("tr");
      tr.className = "pc-extra-row";
      var th = document.createElement("th");
      th.scope = "row";
      th.textContent = row.label;
      var td = document.createElement("td");
      td.className = "pc-num";
      td.textContent = money(row.value);
      tr.appendChild(th);
      tr.appendChild(td);
      stepsBody.insertBefore(tr, payeWorkRow);
    });
  }

  function render() {
    var mode = getMode();
    updateModeUI(mode);

    var parsed = parseInput(input.value);

    var extraPensionParsed = parseOptional(extraPensionEl.value, "Extra pension");
    var prmfParsed = parseOptional(prmfEl.value, "Post-retirement medical fund");
    var mortgageParsed = parseOptional(mortgageEl.value, "Mortgage interest");
    var insuranceParsed = parseOptional(insuranceEl.value, "Insurance premiums");

    if (parsed.error) {
      errorEl.textContent = parsed.error;
      input.setAttribute("aria-invalid", "true");
      emptyEl.hidden = true;
      resultEl.hidden = true;
      netHint.hidden = true;
      return;
    }
    if (extraPensionParsed.error || prmfParsed.error || mortgageParsed.error || insuranceParsed.error) {
      errorEl.textContent = extraPensionParsed.error || prmfParsed.error || mortgageParsed.error || insuranceParsed.error;
      input.setAttribute("aria-invalid", "true");
      emptyEl.hidden = true;
      resultEl.hidden = true;
      netHint.hidden = true;
      return;
    }
    errorEl.textContent = "";
    input.removeAttribute("aria-invalid");

    if (parsed.empty) {
      emptyEl.hidden = false;
      resultEl.hidden = true;
      netHint.hidden = true;
      return;
    }

    var options = {
      extraPension: extraPensionParsed.value,
      prmf: prmfParsed.value,
      mortgageInterest: mortgageParsed.value,
      insurancePremium: insuranceParsed.value
    };

    var gross;
    if (mode === "net") {
      gross = grossFromNet(parsed.value, options);
      var r = compute(gross, options);
      if (r.net < 0) {
        errorEl.textContent = "The deductions are higher than this pay. Check the amount.";
        input.setAttribute("aria-invalid", "true");
        emptyEl.hidden = true;
        resultEl.hidden = true;
        netHint.hidden = true;
        return;
      }
      netHint.textContent = "For a take-home pay of KES " + money(parsed.value) + " you need a gross pay of KES " + money(gross) + ".";
      netHint.hidden = false;
    } else {
      gross = parsed.value;
      var r = compute(gross, options);
      if (r.net < 0) {
        errorEl.textContent = "The deductions are higher than this pay. Check the amount.";
        input.setAttribute("aria-invalid", "true");
        emptyEl.hidden = true;
        resultEl.hidden = true;
        return;
      }
      netHint.hidden = true;
    }

    emptyEl.hidden = true;
    resultEl.hidden = false;

    set("pcGrossOut", money(r.gross));
    set("pcNssf", money(r.nssf));
    set("pcShif", money(r.shif));
    set("pcLevy", money(r.levy));
    set("pcPaye", money(r.paye));
    set("pcNet", money(r.net));

    set("pcWGross", money(r.gross));
    set("pcWDeductions", money(r.nssf + r.shif + r.levy + r.pensionDeduction + r.prmfDeduction + r.mortgageDeduction));
    set("pcTaxable", money(r.taxable));
    set("pcTaxBefore", money(r.taxBefore));
    set("pcRelief", money(Math.min(r.relief, r.taxBefore)));
    set("pcWPaye", money(r.paye));
    renderBands(r.bands);
    renderExtraRows(r);

    var ec = employerCost(gross);
    set("pcEmpGross", money(ec.gross));
    set("pcEmpNssf", money(ec.employerNssf));
    set("pcEmpLevy", money(ec.employerLevy));
    set("pcEmpNita", money(ec.nita));
    set("pcEmpTotal", money(ec.total));

    // Update print date
    var now = new Date();
    var dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    var timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    printDateEl.textContent = "Estimate calculated on " + dateStr + " at " + timeStr + " at apsis.co.ke/paye-calculator.html";
    printDateEl.hidden = false;
  }

  input.addEventListener("input", render);
  [extraPensionEl, prmfEl, mortgageEl, insuranceEl].forEach(function (el) {
    el.addEventListener("input", render);
  });
  modeRadios.forEach(function (radio) {
    radio.addEventListener("change", render);
  });
  printBtn.addEventListener("click", function () { window.print(); });
  document.getElementById("pcForm").addEventListener("submit", function (e) { e.preventDefault(); render(); });
  render();
})();
