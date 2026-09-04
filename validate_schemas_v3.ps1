$files = @(
    "accountants-in-nairobi.html",
    "financial-advisor.html",
    "vat-compliance-kenya.html",
    "import-export-tax-advisory.html",
    "content\insights\kra-tax-consultant-kenya.html",
    "content\insights\Payroll-tax-services-kenya.html"
)

foreach ($file in $files) {
    $path = "C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\$file"
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        
        $matches = [System.Text.RegularExpressions.Regex]::Matches($content, '(?s)<script type="application/ld\+json">(.*?)</script>')
        
        Write-Host "`n=== $file ==="
        $scriptNum = 0
        foreach ($match in $matches) {
            $scriptNum++
            $json = $match.Groups[1].Value.Trim()
            Write-Host "  Script $($scriptNum):"
            try {
                $parsed = $json | ConvertFrom-Json
                Write-Host "    Valid JSON"
                Write-Host "    Properties: $($parsed.PSObject.Properties.Name -join ', ')"
                # Try different ways to access @type
                $atype = $parsed.'@type'
                if ($null -eq $atype) { $atype = $parsed.'@Type' }
                if ($null -eq $atype) { $atype = $parsed.psobject.Properties['@type']?.Value }
                Write-Host "    @type: $($atype)"
            } catch {
                Write-Host "    INVALID JSON: $($_.Exception.Message)"
            }
        }
    } else {
        Write-Host "File not found: $file"
    }
}