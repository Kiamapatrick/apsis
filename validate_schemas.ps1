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
        
        # Extract all JSON-LD scripts
        $matches = [System.Text.RegularExpressions.Regex]::Matches($content, '(?s)<script type="application/ld\+json">(.*?)</script>')
        
        Write-Host "`n=== $file ==="
        $scriptNum = 0
        foreach ($match in $matches) {
            $scriptNum++
            $json = $match.Groups[1].Value.Trim()
            Write-Host "  Script $scriptNum:"
            try {
                $parsed = $json | ConvertFrom-Json
                Write-Host "    ✓ Valid JSON"
                Write-Host "    @type: $($parsed['@type'])"
                if ($parsed['@type'] -eq 'Service') {
                    Write-Host "    Service name: $($parsed.name)"
                    Write-Host "    Provider: $($parsed.provider.name)"
                    Write-Host "    URL: $($parsed.url)"
                } elseif ($parsed['@type'] -eq 'Person') {
                    Write-Host "    Person name: $($parsed.name)"
                    Write-Host "    JobTitle: $($parsed.jobTitle)"
                    Write-Host "    URL: $($parsed.url)"
                }
            } catch {
                Write-Host "    ✗ INVALID JSON: $($_.Exception.Message)"
                # Show first 200 chars for debugging
                Write-Host "    Content preview: $($json.Substring(0, [Math]::Min(200, $json.Length)))"
            }
        }
    } else {
        Write-Host "File not found: $file"
    }
}