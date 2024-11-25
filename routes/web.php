<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PersonalDataSheetController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ServiceRecordController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\StatementOfAssetsLiabilityAndNetworthController;
use App\Mail\AccountCreation;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
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
    Route::get('/profile/profile', [ProfileController::class, 'edit'])->name('profile.profile');
    Route::get('/profile/settings', [ProfileController::class, 'edit'])->name('profile.settings');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/profile/upload-avatar', [ProfileController::class, 'upload_avatar'])->name('profile.avatar');
    Route::post('/profile/settings/enable-emails', [ProfileController::class, 'enableEmails'])->name('profile.settings.emails');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('general-search')->group(function () {
        Route::controller(SearchController::class)->group(function () {
            Route::get('/', 'index')->name('general-search');
            Route::get('/json', 'indexJson')->name('general-search.json');
            Route::get('/view/{user}', 'view_searched')->name('general-search.view');
            Route::get('/attendances/{user}', 'attendances')->name('general-search.attendances');
            Route::get('/certificates/{user}', 'certificates')->name('general-search.certificates');
            Route::get('/user-pds/{userId}', 'getPds')->name('general-search.pds');
        });
    });

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/sy', [DashboardController::class, 'getSY'])->name('dashboard.sy');
    Route::get('/dashboard/pannelList', [DashboardController::class, 'personnelList'])->name('dashboard.personnelList');
    Route::get('/dashboard/applied-leaves/{sy}', [DashboardController::class, 'leaveApplicationsJson'])->name('dashboard.leave.applications');
    Route::post('/dashboard/new-school-year', [DashboardController::class, 'newSchoolYear'])
        ->middleware(['role:HR'])->name('dashboard.new.school_year');

    Route::prefix('notes')->group(function () {
        Route::controller(NoteController::class)->group(function () {
            Route::get('/', 'index')->name('notes');
            Route::get('/view', 'show')->name('notes.show');

            Route::post('/save/{note?}', 'store')->name('notes.save');
            Route::post('/delete/{note}', 'destroy')->name('notes.delete');
        });
    });

    Route::prefix('personnel')->group(function () {
        Route::controller(PersonnelController::class)->group(function () {
            Route::get('/', 'index')->middleware(['role:HR,HOD'])->name('personnel');
            Route::get('/new-personnel/edit/{user?}', 'edit')->name('personnel.edit');
            Route::get('/view-pds-user/{userId}', fn ($userId) => response()->json(User::find($userId)))->name('personnel.view-pds.user');

            Route::middleware(['role:HR'])->group(function () {
                Route::get('/tardiness', 'tardiness')->name('personnel.tardiness');
                Route::get('/tardiness/json', 'tardinessJson')->name('personnel.tardiness.json');
                Route::get('/tardiness/search-attendance', 'tardiness_search')->name('personnel.tardiness.att.search');
                Route::get('/new-personnel/{role}', 'create')->name('personnel.new');

                Route::post('/new-personnel', 'store')->name('personnel.new.store');
                Route::post('/update-personnel/{user?}', 'update')->name('personnel.update');
                Route::post('/delete-personnel/{user?}', 'delete')->name('personnel.delete');
                Route::post('/tardiness/add', 'store_tardiness')->name('personnel.tardiness.add');
                Route::post('/tardiness-update/{tardiness}', 'update_tardiness')->name('personnel.tardiness.update');
                Route::post('/tardiness-delete/{tardiness}', 'delete_tardiness')->name('personnel.tardiness.delete');
            });
        });

        Route::controller(PersonnelController::class)->group(function () {
            Route::get('/json', 'indexJson')->name('personnel.json');
        })->middleware(['role:HR,HOD']);
    });

    // tardiness on the personnel's page
    Route::get('tardiness', [PersonnelController::class, 'userTardiness'])->name('tardiness');

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

    Route::prefix('myapprovals')->group(function () {
        Route::prefix('leave')->group(function () {
            Route::controller(LeaveController::class)->group(function () {
                Route::get('/', 'index')->name('myapprovals.leave');
                Route::get('/json', 'indexJson')->name('myapprovals.leave.json');
                Route::get('/view/{leave?}/{user?}', 'view')->name('myapprovals.leave.view');
                Route::get('/apply-for-leave', 'apply_for_leave')->name('myapprovals.leave.apply');

                Route::post('/respond/{user}/{leave}', 'application_for_leave_action')->middleware(['role:HOD,HR'])->name('myapprovals.leave.respond');
            });
        });

        Route::prefix('pds')->group(function () {
            Route::controller(PersonalDataSheetController::class)->group(function () {
                Route::get('/', 'index')->name('myapprovals.pds');
            });
        });

        Route::prefix('saln')->group(function () {
            Route::controller(StatementOfAssetsLiabilityAndNetworthController::class)->group(function () {
                Route::get('/', 'index')->name('myapprovals.saln');
            });
        });

        Route::prefix('service-records')->group(function () {
            Route::controller(ServiceRecordController::class)->group(function () {
                Route::get('/', 'index')->name('myapprovals.service-records');
            });
        });
    });

    Route::prefix('myreports')->group(function () {
        Route::controller(ReportController::class)->group(function () {
            Route::get('/list-of-personnel', 'listOfPersonnel')->name('reports.personnel');
            Route::get('/ipcr', 'listOfIPCR')->name('reports.ipcr');
            Route::get('/saln', 'listOfSALN')->name('reports.saln');
            Route::get('/search-ipcr', 'searchIPCR')->name('reports.searchIPCR');
            Route::get('/search-saln', 'searchSALN')->name('reports.searchSALN');
            Route::get('/ipcr-personnel-unlisted/{sy?}', 'getIPCRUnlisted')->name('reports.unlistedIPCR');
            Route::get('/saln-personnel-unlisted/{year?}', 'getSALNUnlisted')->name('reports.unlistedSALN');
            Route::get('/filter-ipcr/{year?}', 'filterIPCRByYear')->name('reports.filter.ipcr');
            Route::get('/filter-saln/{year?}', 'filterSALNByYear')->name('reports.filter.saln');

            Route::post('/excel-ipcr-upload', 'upload_ipcr')->name('reports.excel.ipcr.upload');
            Route::post('/excel-saln-upload', 'upload_saln')->name('reports.excel.saln.upload');
            Route::post('/add-ipcr', 'addIPCRRow')->name('reports.addIPCR');
            Route::post('/add-saln', 'addSALNRow')->name('reports.addSALN');
            Route::post('/update-ipcr/{ipcrId}', 'updateIPCRRow')->name('reports.updateIPCR');
            Route::post('/update-saln/{salnId}', 'updateSALNRow')->name('reports.updateSALN');
            Route::delete('/delete-ipcr/{ipcrId}', 'deleteIPCRRow')->name('reports.deleteIPCR');
            Route::delete('/delete-saln/{salnId}', 'deleteSALNRow')->name('reports.deleteSALN');
        });
    });

    Route::prefix('pds')->group(function () {
        Route::controller(PersonalDataSheetController::class)->group(function () {
            Route::get('/', 'index')->name('pds');

            Route::post('/pds-excel-upload/{user}', 'store_excel_pds')->name('pds.upload');
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
            Route::post('/pds-validate', 'setApprovePDSDownload')->name('pds.validation');
            Route::post('/pds-approve/{pds}', 'setApprovePDSDownload')->name('pds.approve');
        });
    });

    Route::prefix('service-records')->group(function () {
        Route::controller(ServiceRecordController::class)->group(function () {
            Route::get('/', 'index')->name('service-records');
            Route::get('/json', 'indexJson')->name('service-records.json');
            Route::get('/certificates/json/{user}', 'userCertificates')->name('service-records.certificates');

            Route::post('/upload', 'store')->name('service-records.post');
            Route::post('/delete/{sr}', 'delete')->name('service-records.delete');
            Route::post('/respond/certificate/{certificate}', 'respondCertificate')->name('service-records.respond.certificate');
        });
    });

    Route::prefix('messages')->group(function () {
        Route::controller(MessageController::class)->group(function () {
            Route::get('/', 'index')->name("messages");
            Route::get('/messages-list', 'messages')->name('messages.list');
            Route::get('/conversations/{userId}/{messageId?}', 'conversations')->name('messages.conversation');
            Route::get('/search/{search}', 'searchUser')->name("messages.search");
            Route::get('/unreadmessages', 'countUnreadMessages')->name('messages.unreadmessages');
            Route::get('/search/conversation/{messageId}/{search}', 'searchConversation')->name('messages.search_conversation');
            Route::get('/searched-conversation/{messageId}/{convoId}', 'getConversationOnSearch')->name('messages.searched_convo');

            Route::post('/send/{user}/{messageId?}', 'send')->name('messages.send');
            Route::post('/seen/{message}', 'setMessageAsSeen')->name('message.seen');
            Route::post('/delete/{message}', 'deleteMessage')->name('messages.delete');
        });
    });

    Route::prefix('notification')->group(function () {
        Route::controller(NotificationController::class)->group(function () {
            Route::get('/', 'index')->name("notification");
            Route::get('/json', 'indexJson')->name("notification.json");
            Route::get('/notif-read/{notif}', 'markAsRead')->name("notification.masrkRead");
            Route::get('/redirect/{notif}', 'redirectFromNotification')->name("notification.redirect");
            Route::get('/unread-notifications', 'unreadNotifications')->name('notification.unreads');
        });
    });

    Route::prefix('saln')->group(function () {
        Route::controller(StatementOfAssetsLiabilityAndNetworthController::class)->group(function () {
            Route::get('/', 'index')->name('saln');
            Route::get('/add/{saln?}', 'create')->name('saln.create');
            Route::get('/view/{saln}', 'jsonSalnView')->name('saln.json.view');

            Route::post('/save/{idToUpdate?}', 'store')->name('saln.save');
            Route::post('/approve/{saln}', 'setApproveSaln')->middleware(['role:HR'])->name('saln.approve');
        });
    });
});

require __DIR__.'/auth.php';
