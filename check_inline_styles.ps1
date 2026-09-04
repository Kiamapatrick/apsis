$files = @('accountants-in-nairobi.html', 'financial-advisor.html', 'vat-compliance-kenya.html', 'import-export-tax-advisory.html', 'content\insights\kra-tax-consultant-kenya.html', 'content\insights\Payroll-tax-services-kenya.html')
foreach ($f in $files) {
    $path = 'C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\' + $f
    $content = Get-Content $path -Raw
    $matches = [System.Text.RegularExpressions.Regex]::Matches($content, 'style="[^"]*"')
    if ($matches.Count -gt 0) {
        Write-Host ($f + ': ' + $matches.Count + ' inline style attributes found')
        foreach ($m in $matches) {
            Write-Host ('  ' + $m.Value)
        }
    } else {
        Write-Host ($f + ': NO inline styles')
    }
}