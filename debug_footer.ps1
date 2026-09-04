$content = Get-Content 'C:\Users\ADMIN\Downloads\All-work\new work\apsis-new\index.html' -Raw
$idx = $content.IndexOf('footer-links-col')
if ($idx -gt -1) {
    Write-Host $content.Substring($idx, 1000)
}