<?php

namespace App\Http\Controllers\Api\V1\Admin\Concerns;

use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Streamed CSV downloads (UTF-8 BOM so Excel opens Arabic/French correctly).
 */
trait ExportsCsv
{
    /**
     * @param  array<int, string>  $headers
     * @param  iterable<int, array<int, mixed>>  $rows
     */
    protected function csvDownload(string $filename, array $headers, iterable $rows): StreamedResponse
    {
        return response()->streamDownload(function () use ($headers, $rows): void {
            $handle = fopen('php://output', 'w');

            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, $headers);

            foreach ($rows as $row) {
                fputcsv($handle, $row);
            }

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }
}
