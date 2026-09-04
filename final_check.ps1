Write-Host "=== FINAL VERIFICATION ==="

# 1. Sitemap
$c = Get-Content 'C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\sitemap.xml' -Raw
if ($c -match 'Payroll-tax-services-kenya.html') { Write-Host "PASS: Sitemap casing" } else { Write-Host "FAIL: Sitemap" }

# 2. Footer links
$files = 'index.html','about.html','services.html','contact.html','workwithus.html','terms.html','privacy.html','404.html','accountants-in-nairobi.html','financial-advisor.html','vat-compliance-kenya.html','import-export-tax-advisory.html','content\insights\kra-tax-consultant-kenya.html','content\insights\Payroll-tax-services-kenya.html','content\blogs\business-taxes-in-kenya.html','content\blogs\kra-filing-deadline-kenya.html','content\blogs\kra-tax-demand-notice-kenya.html','content\blogs\hire-accountant-vs-diy-kenya.html'
$hrefs = 'accountants-in-nairobi.html','/content/insights/kra-tax-consultant-kenya.html','financial-advisor.html','/content/insights/Payroll-tax-services-kenya.html','vat-compliance-kenya.html','import-export-tax-advisory.html'
$allGood = $true
foreach ($f in $files) {
  $p = 'C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\' + $f
  if (Test-Path $p) {
    $c = Get-Content $p -Raw
    $cnt = 0
    foreach ($h in $hrefs) { if ($c -match [regex]::Escape($h)) { $cnt++ } }
    if ($cnt -eq 6) { Write-Host ("PASS: " + $f) } else { Write-Host ("FAIL: " + $f + " has " + $cnt + " of 6 links"); $allGood=$false }
  } else { Write-Host ("MISSING: " + $f); $allGood=$false }
}
if ($allGood) { Write-Host "OVERALL: All 16 pages have identical 6 service links" }

# JSON-LD
Write-Host ""
Write-Host "Schema validation:"
$sf = 'accountants-in-nairobi.html','financial-advisor.html','vat-compliance-kenya.html','import-export-tax-advisory.html','content\insights\kra-tax-consultant-kenya.html','content\insights\Payroll-tax-services-kenya.html'
foreach ($f in $sf) {
  $p = 'C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\' + $f
  if (Test-Path $p) {
    $c = Get-Content $p -Raw
    $m = [System.Text.RegularExpressions.Regex]::Matches($c, '(?s)<script type="application/ld\+json">(.*?)</script>')
    $v = $true
    foreach ($match in $m) {
      try { $json = $match.Groups[1].Value.Trim(); $parsed = $json | ConvertFrom-Json } catch { $v=$false }
    }
    if ($v) { Write-Host ("PASS: " + $f) } else { Write-Host ("FAIL: " + $f) }
  }
}
Write-Host ""
Write-Host "ALL CHECKS COMPLETE"