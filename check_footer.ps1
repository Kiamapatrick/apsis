$files = @('index.html', 'about.html', 'services.html', 'contact.html', 'workwithus.html', 'terms.html', 'privacy.html', '404.html', 'accountants-in-nairobi.html', 'financial-advisor.html', 'vat-compliance-kenya.html', 'import-export-tax-advisory.html')
foreach ($f in $files) {
    $path = 'C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\' + $f
    $content = Get-Content $path -Raw
    if ($content -match 'Our Services') {
        Write-Host ($f + ': Footer Our Services column FOUND')
    } else {
        Write-Host ($f + ': Footer Our Services column MISSING')
    }
}