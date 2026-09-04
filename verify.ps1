# Verification script - simple version

Write-Host "=== VERIFICATION CHECKLIST ==="

# 1. Sitemap casing
Write-Host "`n1. SITEMAP CASING CHECK:"
$content = Get-Content 'C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\sitemap.xml' -Raw
if ($content -match 'Payroll-tax-services-kenya.html') {
    Write-Host "  PASS: Sitemap has capital-P Payroll-tax-services-kenya.html"
} elseif ($content -match 'payroll-tax-services-kenya.html') {
    Write-Host "FAIL: Sitemap has lowercase payroll-tax-services-kenya.html"
} else {
    Write-Host "UNKNOWN: payroll entry not found"
}

# 2. Footer services consistency across all 16 files
Write-Host "`n2. FOOTER SERVICES CONSISTENCY CHECK:"
$files = @(
    'index.html', 'about.html', 'services.html', 'contact.html', 'workwithus.html', 'terms.html', 'privacy.html', '404.html',
    'accountants-in-nairobi.html', 'financial-advisor.html', 'vat-compliance-kenya.html', 'import-export-tax-advisory.html',
    'content\insights\kra-tax-consultant-kenya.html', 'content\insights\Payroll-tax-services-kenya.html',
    'content\blogs\business-taxes-in-kenya.html', 'content\blogs\kra-filing-deadline-kenya.html',
    'content\blogs\kra-tax-demand-notice-kenya.html', 'content\blogs\hire-accountant-vs-diy-kenya.html'
)

$expectedHrefs = @(
    'accountants-in-nairobi.html',
    '/content/insights/kra-tax-consultant-kenya.html',
    'financial-advisor.html',
    '/content/insights/Payroll-tax-services-kenya.html',
    'vat-compliance-kenya.html',
    'import-export-tax-advisory.html'
)

$allMatch = $true
foreach ($f in $files) {
    $path = 'C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\' + $f
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $foundCount = 0
        foreach ($href in $expectedHrefs) {
            if ($content -match [regex]::Escape($href)) {
                $foundCount++
            }
        }
        if ($foundCount -eq 6) {
            Write-Host ("PASS: $f - All 6 service links present")
        } else {
            Write-Host ("FAIL: $f - Only $foundCount/6 links found")
            $allMatch = $false
        }
    } else {
        Write-Host ("MISSING: $f - File not found")
        $allMatch = $false
    }
}
if ($allMatch) { Write-Host "OVERALL: All 16 files have identical 6 service links" }

# 3. Bio deduplication check
Write-Host "`n3. BIO DEDUPLICATION SPOT CHECK:"
$bioFiles = @(
    'vat-compliance-kenya.html',
    'financial-advisor.html',
    'content\insights\kra-tax-consultant-kenya.html',
    'content\insights\Payroll-tax-services-kenya.html',
    'about.html'
)
foreach ($f in $bioFiles) {
    $path = 'C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\' + $f
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        if ($content -match 'Read.*full background on our About page') {
            Write-Host "PASS: $f - Contains 'Read full background on About page' link"
        } else {
            Write-Host "WARN: $f - No 'Read full background' link found"
        }
        $m1 = [System.Text.RegularExpressions.Regex]::Matches($content, 'A seasoned finance and audit professional with over 13 years')
        if ($m1.Count -gt 0) {
            Write-Host "  WARN: $f contains full Mwenda bio (may be untrimmed)"
        }
        $m2 = [System.Text.RegularExpressions.Regex]::Matches($content, 'A seasoned finance and taxation professional with over 14 years')
        if ($m2.Count -gt 0) {
            Write-Host "  WARN: $f contains full Domisiano bio (may be untrimmed)"
        }
        $m3 = [System.Text.RegularExpressions.Regex]::Matches($content, 'A seasoned compliance expert and business advisor with over 15 years')
        if ($m3.Count -gt 0) {
            Write-Host "  WARN: $f contains full Stephen bio (may be untrimmed)"
        }
    }
}

# 4. Schema validation
Write-Host "`n4. JSON-LD SCHEMA VALIDATION:"
$schemaFiles = @(
    'accountants-in-nairobi.html',
    'financial-advisor.html',
    'vat-compliance-kenya.html',
    'import-export-tax-advisory.html',
    'content\insights\kra-tax-consultant-kenya.html',
    'content\insights\Payroll-tax-services-kenya.html'
)
foreach ($f in $schemaFiles) {
    $path = 'C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\' + $f
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $matches = [System.Text.RegularExpressions.Regex]::Matches($content, '(?s)<script type="application/ld\+json">(.*?)</script>')
        $valid = $true
        foreach ($match in $matches) {
            try {
                $json = $match.Groups[1].Value.Trim()
                $parsed = $json | ConvertFrom-Json
            } catch {
                $valid = $false
            }
        }
        if ($valid) { Write-Host "PASS: $f - All JSON-LD valid" } else { Write-Host "FAIL: $f - INVALID JSON-LD" }
    }
}

Write-Host "`n=== VERIFICATION COMPLETE ==="