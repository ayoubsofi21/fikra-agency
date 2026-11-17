@php($dir = app()->getLocale() === 'ar' ? 'rtl' : 'ltr')
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ $dir }}">
<head>
    <meta charset="utf-8">
    <title>{{ config('app.name') }}</title>
</head>
<body style="margin:0;padding:24px;background:#f5f6f8;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
            <td style="padding:24px;background:#111827;color:#ffffff;font-size:18px;font-weight:600;">{{ config('app.name') }}</td>
        </tr>
        <tr>
            <td style="padding:28px 24px;">
                <p style="margin:0 0 8px;font-size:16px;font-weight:600;">{{ $name }}</p>
                <p style="margin:0 0 24px;line-height:1.7;">{{ $intro }}</p>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                    <tr>
                        <td style="border-radius:8px;background:#111827;">
                            <a href="{{ $url }}" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">{{ $action }}</a>
                        </td>
                    </tr>
                </table>

                <p style="margin:0 0 8px;font-size:13px;color:#6b7280;line-height:1.6;">{{ $expires }}</p>
                <p style="margin:0 0 16px;font-size:13px;color:#6b7280;line-height:1.6;">{{ $ignore }}</p>
                <p style="margin:0;font-size:12px;color:#9ca3af;word-break:break-all;">{{ $url }}</p>
            </td>
        </tr>
    </table>
</body>
</html>
