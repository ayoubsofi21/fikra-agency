@php($dir = app()->getLocale() === 'ar' ? 'rtl' : 'ltr')
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ $dir }}">
<head>
    <meta charset="utf-8">
    <title>{{ config('app.name') }}</title>
</head>
<body style="margin:0;padding:24px;background:#f5f6f8;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
            <td style="padding:28px 24px;background:#111827;color:#ffffff;">
                <div style="font-size:18px;font-weight:600;">{{ config('app.name') }}</div>
            </td>
        </tr>
        <tr>
            <td style="padding:28px 24px;">
                <p style="margin:0 0 20px;line-height:1.7;">{{ $intro }}</p>

                @if (! empty($rows))
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f9fafb;border-radius:8px;">
                        @foreach ($rows as $label => $value)
                            <tr>
                                <td style="padding:10px 12px;font-size:13px;color:#6b7280;width:150px;vertical-align:top;">{{ $label }}</td>
                                <td style="padding:10px 12px;font-size:14px;white-space:pre-line;">{{ $value }}</td>
                            </tr>
                        @endforeach
                    </table>
                @endif

                <p style="margin:24px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">{{ $closing }}</p>
            </td>
        </tr>
    </table>
</body>
</html>
