@php($dir = app()->getLocale() === 'ar' ? 'rtl' : 'ltr')
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ $dir }}">
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
</head>
<body style="margin:0;padding:24px;background:#f5f6f8;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
            <td style="padding:20px 24px;background:#111827;color:#ffffff;">
                <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;opacity:.7;">{{ config('app.name') }}</div>
                <div style="font-size:18px;font-weight:600;margin-top:4px;">{{ $title }}</div>
            </td>
        </tr>
        <tr>
            <td style="padding:24px;">
                <p style="margin:0 0 20px;line-height:1.6;">{{ $intro }}</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    @foreach ($rows as $label => $value)
                        <tr>
                            <td style="padding:10px 12px;border-bottom:1px solid #eef0f3;font-size:13px;color:#6b7280;width:170px;vertical-align:top;">{{ $label }}</td>
                            <td style="padding:10px 12px;border-bottom:1px solid #eef0f3;font-size:14px;white-space:pre-line;">{{ $value }}</td>
                        </tr>
                    @endforeach
                </table>

                <p style="margin:24px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">{{ $closing }}</p>
            </td>
        </tr>
    </table>
</body>
</html>
