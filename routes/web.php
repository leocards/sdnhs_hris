<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\PersonalDataSheetController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ServiceRecordController;
use App\Http\Controllers\PersonnelController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

Route::get('/', function () {
    if(Auth::check()){
        if(URL::previous() === URL('/'))
            return redirect('/dashboard');
        else
            return back();
    }
    return Inertia::render('Welcome');
})->name('/');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/profile/settings', [ProfileController::class, 'edit'])->name('profile.settings');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/profile/upload-avatar', [ProfileController::class, 'upload_avatar'])->name('profile.avatar');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('general-search')->group(function () {
        Route::controller(SearchController::class)->group(function () {
            Route::get('/', 'index')->name('general-search');
            Route::get('/json', 'indexJson')->name('general-search.json');
            Route::get('/view/{user}', 'view_searched')->name('general-search.view');
        });
    });


    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('personnel')->group(function () {
        Route::controller(PersonnelController::class)->group(function () {
            Route::get('/', 'index')->middleware(['role:HR,HOD'])->name('personnel');
            Route::get('/new-personnel/edit/{user?}', 'edit')->name('personnel.edit');

            Route::middleware(['role:HR'])->group(function () {
                Route::get('/tardiness', 'tardiness')->name('personnel.tardiness');
                Route::get('/tardiness/json', 'tardinessJson')->name('personnel.tardiness.json');
                Route::get('/tardiness/search-attendance', 'tardiness_search')->name('personnel.tardiness.att.search');
                Route::get('/new-personnel', 'create')->name('personnel.new');

                Route::post('/new-personnel', 'store')->name('personnel.new.store');
                Route::post('/update-personnel/{user?}', 'update')->name('personnel.update');
                Route::post('/delete-personnel/{user?}', 'delete')->name('personnel.delete');
                Route::post('/tardiness', 'store_tardiness')->name('personnel.tardiness.add');
                Route::post('/tardiness-update/{tardiness}', 'update_tardiness')->name('personnel.tardiness.update');
                Route::post('/tardiness-delete/{tardiness}', 'delete_tardiness')->name('personnel.tardiness.delete');
            });
        });

        Route::controller(PersonnelController::class)->group(function () {
            Route::get('/json', 'indexJson')->name('personnel.json');
        })->middleware(['role:HR,HOD']);
    });

    Route::prefix('leave')->group(function () {
        Route::controller(LeaveController::class)->group(function () {
            Route::get('/', 'index')->name('leave');
            Route::get('/json', 'indexJson')->name('leave.json');
            Route::get('/view/{leave?}/{user?}', 'view')->name('leave.view');
            Route::get('/apply-for-leave', 'apply_for_leave')->name('leave.apply');

            Route::post('/respond/{user}/{leave}', 'application_for_leave_action')->middleware(['role:HOD,HR'])->name('leave.respond');
            Route::post('/submit-application-leave', [LeaveController::class, 'store'])->name('leave.submit');
            Route::post('/upload-medical/{leave_id}', [LeaveController::class, 'upload_medical'])->name('leave.upload_medical');
            Route::post('/upload-medical-maternity', [LeaveController::class, 'upload_medical_maternity'])->name('leave.upload_medical_maternity');
        });
    });

    Route::prefix('pds')->group(function () {
        Route::controller(PersonalDataSheetController::class)->group(function () {
            Route::post('/pds-excel-upload', 'store_excel_pds')->name('pds.upload');
            Route::post('/pds-c1-upload', 'store_c1')->name('pds.c1.upload');
            Route::post('/pds-c1-pi-upload', 'store_pi')->name('pds.c1.pi.upload');
            Route::post('/pds-c1-fb-upload', 'store_fb')->name('pds.c1.fb.upload');
            Route::post('/pds-c1-eb-upload', 'store_eb')->name('pds.c1.eb.upload');
            Route::post('/pds-c2-cs-upload', 'store_cs')->name('pds.c2.cs.upload');
            Route::post('/pds-c2-we-upload', 'store_we')->name('pds.c2.we.upload');
            Route::post('/pds-c3-vw-upload', 'store_vw')->name('pds.c3.vw.upload');
            Route::post('/pds-c3-ld-upload', 'store_ld')->name('pds.c3.ld.upload');
            Route::post('/pds-c3-oi-upload', 'store_oi')->name('pds.c3.oi.upload');
            Route::post('/pds-c4-upload', 'store_c4')->name('pds.c4.upload');
        });
    });


    Route::prefix('service-records')->group(function () {
        Route::controller(ServiceRecordController::class)->group(function () {
            Route::get('/', 'index')->name('service-records');
            Route::get('/json', 'indexJson')->name('service-records.json');

            Route::post('/upload', 'store')->name('service-records.post');
            Route::post('/delete/{sr}', 'delete')->name('service-records.delete');
        });
    });

    Route::prefix('reports')->group(function () {
        Route::controller(ReportController::class)->group(function () {
            Route::get('/', 'index')->name('reports');

            Route::post('/add-ipcr', 'addIPCRRow')->name('reports.addIPCR');
            Route::post('/add-saln', 'addSALNRow')->name('reports.addSALN');
            Route::post('/update-ipcr/{ipcrId}', 'updateIPCRRow')->name('reports.updateIPCR');
            Route::post('/update-saln/{salnId}', 'updateSALNRow')->name('reports.updateSALN');
            Route::delete('/delete-ipcr/{ipcrId}', 'deleteIPCRRow')->name('reports.deleteIPCR');
            Route::delete('/delete-saln/{salnId}', 'deleteSALNRow')->name('reports.deleteSALN');
        });
    });

    Route::get('/messages', fn () => Inertia::render('Messages/Messages'))->name("messages");
    Route::get('/notification', fn () => Inertia::render('Notification/Notification'))->name("notification");

    Route::get("/reports/salnpdf", fn () => Inertia::render('Reports/samplePdf'));
});

require __DIR__.'/auth.php';
