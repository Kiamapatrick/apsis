$content = Get-Content 'C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\about.html' -Raw
$matches = [System.Text.RegularExpressions.Regex]::Matches($content, '5\+ years')
foreach ($m in $matches) {
    Write-Host "Found: $($m.Value) at index $($m.Index)"
    # Show context
    $start = [Math]::Max(0, $m.Index - 50)
    $len = [Math]::Min(100, $content.Length - $start)
    Write-Host "Context: $($content.Substring($start, $len))"
}