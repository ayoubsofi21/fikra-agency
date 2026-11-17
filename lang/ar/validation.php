<?php

/*
|--------------------------------------------------------------------------
| Arabic validation strings (only the rules this API uses)
|--------------------------------------------------------------------------
*/

return [

    'accepted' => 'يجب قبول حقل :attribute.',
    'array' => 'يجب أن يكون حقل :attribute مصفوفة.',
    'boolean' => 'يجب أن تكون قيمة حقل :attribute صحيحة أو خاطئة.',
    'confirmed' => 'تأكيد حقل :attribute غير مطابق.',
    'date' => 'حقل :attribute ليس تاريخًا صالحًا.',
    'email' => 'يجب أن يكون حقل :attribute بريدًا إلكترونيًا صالحًا.',
    'exists' => 'القيمة المحددة لحقل :attribute غير صالحة.',
    'file' => 'يجب أن يكون حقل :attribute ملفًا.',
    'image' => 'يجب أن يكون حقل :attribute صورة.',
    'in' => 'القيمة المحددة لحقل :attribute غير صالحة.',
    'integer' => 'يجب أن يكون حقل :attribute عددًا صحيحًا.',
    'numeric' => 'يجب أن يكون حقل :attribute رقمًا.',
    'regex' => 'صيغة حقل :attribute غير صالحة.',

    'max' => [
        'array' => 'لا يجوز أن يحتوي حقل :attribute على أكثر من :max عنصر.',
        'file' => 'لا يجوز أن يتجاوز حجم ملف :attribute :max كيلوبايت.',
        'numeric' => 'لا يجوز أن تزيد قيمة حقل :attribute عن :max.',
        'string' => 'لا يجوز أن يتجاوز حقل :attribute :max حرفًا.',
    ],

    'mimes' => 'يجب أن يكون الملف :attribute من النوع: :values.',
    'min' => [
        'array' => 'يجب أن يحتوي حقل :attribute على :min عنصرًا على الأقل.',
        'file' => 'يجب ألا يقل حجم ملف :attribute عن :min كيلوبايت.',
        'numeric' => 'يجب ألا تقل قيمة حقل :attribute عن :min.',
        'string' => 'يجب ألا يقل حقل :attribute عن :min حرفًا.',
    ],

    'required' => 'حقل :attribute مطلوب.',
    'required_if' => 'حقل :attribute مطلوب عندما تكون قيمة :other هي :value.',
    'required_with' => 'حقل :attribute مطلوب عند وجود :values.',
    'required_without' => 'حقل :attribute مطلوب عند غياب :values.',
    'string' => 'يجب أن يكون حقل :attribute نصًا.',
    'unique' => 'قيمة حقل :attribute مستخدمة بالفعل.',
    'uploaded' => 'فشل رفع الملف :attribute.',
    'url' => 'يجب أن يكون حقل :attribute رابطًا صالحًا.',

    'attributes' => [
        'name' => 'الاسم',
        'email' => 'البريد الإلكتروني',
        'phone' => 'الهاتف',
        'company' => 'الشركة',
        'website' => 'الموقع الإلكتروني',
        'description' => 'الوصف',
        'message' => 'الرسالة',
        'subject' => 'الموضوع',
        'project_type' => 'نوع المشروع',
        'type' => 'نوع المشروع',
        'budget' => 'الميزانية',
        'budget_range' => 'الميزانية',
        'timeline' => 'المدة',
        'files' => 'الملفات',
        'files.*' => 'ملف',
        'attachment' => 'المرفق',
        'solution_id' => 'الحل',
        'solution_slug' => 'الحل',
    ],

];
