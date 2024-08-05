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
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/profile/settings', [ProfileController::class, 'edit'])->name('profile.settings');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/general-search', [SearchController::class, 'index'])->name('general-search');
    Route::get('/general-search/view/{user}', [SearchController::class, 'view_searched'])->name('general-search.view');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('personnel')->group(function () {
        Route::controller(PersonnelController::class)->group(function () {
            Route::get('/', 'index')->middleware(['role:HR,HOD'])->name('personnel');
            Route::get('/new-personnel/edit/{user?}', 'edit')->name('personnel.edit');

            Route::middleware(['role:HR'])->group(function () {
                Route::get('/tardiness', 'tardiness')->name('personnel.tardiness');
                Route::get('/new-personnel', 'create')->name('personnel.new');
    
                Route::post('/new-personnel', 'store')->name('personnel.new.store');
                Route::post('/update-personnel/{user?}', 'update')->name('personnel.update');
                Route::post('/tardiness', 'store_tardiness')->name('personnel.tardiness.add');
            });
        });

        Route::controller(PersonnelController::class)->group(function () {
            Route::get('/list', 'personnel_list')->name('personnel.list');
        })/* ->middleware(['role:HR,HOD']) */;
    });
    
    Route::prefix('leave')->group(function () {
        Route::controller(LeaveController::class)->group(function () {
            Route::get('/', 'index')->name('leave');
            Route::get('/view/{leave?}/{user?}', 'view')->name('leave.view');
            Route::get('/leave/apply-for-leave', 'apply_for_leave')->name('leave.apply');

            Route::post('/respond/{user}/{leave}', 'application_for_leave_action')->middleware(['role:HOD,HR'])->name('leave.respond');
            Route::post('/leave/submit-application-leave', [LeaveController::class, 'store'])->name('leave.submit');
            Route::post('/upload-medical/{leave_id}', [LeaveController::class, 'upload_medical'])->name('leave.upload_medical');
            Route::post('/upload-medical-maternity', [LeaveController::class, 'upload_medical_maternity'])->name('leave.upload_medical_maternity');
        });
    });

    Route::post('/pds-upload', [PersonalDataSheetController::class, 'store_pds'])->name('pds.upload');

    Route::get('/service-records', [ServiceRecordController::class, 'index'])->name('service-records');
    Route::post('/service-records', [ServiceRecordController::class, 'store'])->name('service-records.post');

    Route::prefix('reports')->group(function () {
        Route::controller(ReportController::class)->group(function () {
            Route::get('/', 'index')->name('reports');
            
            Route::post('/add-ipcr', 'addIPCRRow')->name('reports.addIPCR');
            Route::post('/add-saln', 'addSALNRow')->name('reports.addSALN');
        });
    });

    Route::get('/messages', fn () => Inertia::render('Messages/Messages'))->name("messages");
    Route::get('/notification', fn () => Inertia::render('Notification/Notification'))->name("notification");

    Route::get("/reports/salnpdf", fn () => Inertia::render('Reports/samplePdf'));
});

require __DIR__.'/auth.php';
