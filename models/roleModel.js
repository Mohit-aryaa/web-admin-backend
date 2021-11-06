var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var roleSchema = new Schema({
	'roleName' : String,
	'permissions' : {
		type: {
			dashboard: {
				type: {
					canSeeDefaultDashboard: Boolean,
					canSeeAcademyDashboard: Boolean,
					canSeeEcommerceDashboard: Boolean,
					canSeeHospitalDashboard: Boolean,
					canSeeHrmDashboard: Boolean,
				}
			},
			authentication: {
				type: {
					canSeeRegistration: Boolean,
					canSeeForgetPassword: Boolean,
					canseeResetPassword: Boolean
				}
			},
			database: {
				type: {
					canSeeBasicDatabase: Boolean,
					canManageFunctionalDatabase: Boolean,
					canSeeAdvanceDatabase: Boolean,
					canSeeResponsiveDatabase: Boolean,
					canSeeFilterTypeDatabase: Boolean,
					canSeePaginationTypeDatabase: Boolean,
					canViewGridViewDatabase: Boolean
				}
			},
			form: {
				type: {
					canSeeFormLayouts: Boolean,
					canseeFormElements: Boolean,
					canSeeFormValidation: Boolean,
					canSeeTextEditor: Boolean,
				}
			},
			uiElements: {
				type: {
					canSeeAvatar: Boolean,
					canSeebagdesPills: Boolean,
					canSeebuttons: Boolean,
					canSeeCards: Boolean,
					canSeeCheckboxesRadios: Boolean,
					canSeeErrorNotes: Boolean,
					canSeeIcons: Boolean,
					canSeeModals: Boolean,
					canSeeNothingToShow: Boolean,
					canSeeTabs: Boolean,
				}
			},
			SamplePages: {
				type: {
					defaultViewChat: Boolean,
					canSeeUserProfile: Boolean,
					canManageCalendarView: Boolean,
					canManageKanbanView: Boolean,
					canManageReport: Boolean,
					canSeeBlankPage: Boolean,
				}
			},
			errorPages: {
				type: {
					canSeeError400: Boolean,
					canSeeError401: Boolean,
					canSeeError403: Boolean,
					canSeeError404: Boolean,
					defaultViewError405: Boolean,
					canSeeError503: Boolean,
				}
			},
			userAndRoles: {
				type: {
					canViewUserList: Boolean,
					canInviteUser: Boolean,
					canUpdateUser: Boolean,
					canDeleteUser: Boolean,
					canAttachRolesToUsers: Boolean,
					canDeAttachRolesToUsers: Boolean,
					canViewroleList: Boolean,
					canCreateRole: Boolean,
					canUpdateRole: Boolean,
					canDeleteRole: Boolean,
					canAttachUserToRole: Boolean,
				}
			},
			settings: {
				type: {
					ViewSettingList: Boolean,
					updateSetting: Boolean,
					viewEmailSettings: Boolean,
					updateEmailSettings: Boolean,
					viewSmsSettings: Boolean,
					updateSmsSettings: Boolean,
					viewGoogleRecaptchaSettings: Boolean,
					defaultViewPaymentMethodSettings: Boolean,
					defaultUpdatePaymentMethodSettings: Boolean,
					updateGoogleRecaptchaSettings: Boolean,
					viewNotificationSettings: Boolean,
					updateNotificationSettings: Boolean,
					viewNotificationTemplates: Boolean,
					updateNotificationTemplates: Boolean,
					viewPaymentMethod: Boolean,
					updatePaymentMethod: Boolean,
					deletePaymentMethod: Boolean
				}
			}
		}
	}

});

module.exports = mongoose.model('role', roleSchema);
