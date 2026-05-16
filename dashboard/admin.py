from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import redirect
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from .models import EVData
from .models import Feedback


class EVDataAdmin(admin.ModelAdmin):

    list_display = ['make', 'state', 'year']

    def changelist_view(self, request, extra_context=None):

        extra_context = extra_context or {}

        extra_context['dashboard_url'] = '/'

        return super().changelist_view(
            request,
            extra_context=extra_context
        )
class CustomAdminSite(admin.AdminSite):

    site_header = "EV Dashboard Admin"

    def get_urls(self):

        urls = super().get_urls()

        custom_urls = [
            path(
                'upload-csv/',
                self.admin_view(self.upload_csv_redirect)
            ),
        ]

        return custom_urls + urls

    def upload_csv_redirect(self, request):

        return redirect('/dashboard/upload-csv/')

    def index(self, request, extra_context=None):

        extra_context = extra_context or {}

        extra_context['upload_csv_url'] = '/dashboard/upload-csv/'

        return super().index(
            request,
            extra_context=extra_context
        )

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'email',
        'rating',
        'created_at'
    )

    search_fields = (
        'name',
        'email',
        'message'
    )

    list_filter = (
        'rating',
        'created_at'
    )

    ordering = ('-created_at',)
        
admin_site = CustomAdminSite(name='custom_admin')       
# REGISTER MODEL HERE
admin_site.register(EVData, EVDataAdmin)
admin_site.register(Feedback, FeedbackAdmin)
admin_site.register(User, UserAdmin)
admin_site.register(Group, GroupAdmin)