$footerServicesColumn = @'
                <div class="footer-links-col">
                    <h5>Our Services</h5>
                    <ul>
                        <li><a href="accountants-in-nairobi.html"><i class="bi bi-calculator"></i> Accountants in Nairobi</a></li>
                        <li><a href="/content/insights/kra-tax-consultant-kenya.html"><i class="bi bi-cash-coin"></i> Tax Advisors</a></li>
                        <li><a href="financial-advisor.html"><i class="bi bi-graph-up-arrow"></i> Financial Advisor</a></li>
                        <li><a href="/content/insights/Payroll-tax-services-kenya.html"><i class="bi bi-people"></i> Payroll Services Kenya</a></li>
                        <li><a href="vat-compliance-kenya.html"><i class="bi bi-receipt"></i> VAT Compliance Kenya</a></li>
                        <li><a href="import-export-tax-advisory.html"><i class="bi bi-globe"></i> Import/Export Tax Advisory</a></li>
                    </ul>
                </div>
'@

$files = @(
    "index.html",
    "about.html",
    "services.html",
    "contact.html",
    "workwithus.html",
    "terms.html",
    "privacy.html",
    "404.html",
    "accountants-in-nairobi.html",
    "financial-advisor.html",
    "vat-compliance-kenya.html",
    "import-export-tax-advisory.html"
)

foreach ($file in $files) {
    $path = "C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\$file"
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        
        # Use regex with Singleline option to match across newlines
        $pattern = '(<div class="footer-links-col">\s*<h5>Quick Links</h5>\s*<ul>.*?</ul>\s*</div>\s*)(<div class="footer-map-col">)'
        $regex = [System.Text.RegularExpressions.Regex]::new($pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
        
        if ($regex.IsMatch($content)) {
            $replacement = '$1' + $footerServicesColumn + '$2'
            $newContent = $regex.Replace($content, $replacement)
            if ($newContent -ne $content) {
                Set-Content -Path $path -Value $newContent -NoNewline
                Write-Host "Updated: $file"
            } else {
                Write-Host "No change needed: $file"
            }
        } else {
            Write-Host "Pattern not found in: $file"
        }
    } else {
        Write-Host "File not found: $file"
    }
}