"""
URL configuration for ev_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
"""
URL configuration for ev_project project.
"""

from dashboard.admin import admin_site
from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.shortcuts import redirect
from dashboard import views


# ✅ Redirect root URL to login page
def home_redirect(request):
    
    if request.user.is_authenticated:

        return redirect('/dashboard/')

    return redirect('/login/')

urlpatterns = [

    # ✅ FIRST PAGE = LOGIN
    path('', home_redirect,name='home'),

    # ADMIN
    path('admin/', admin_site.urls),

    # AUTH
    path('login/', views.custom_login, name='login'),

    path(
        'logout/',
        auth_views.LogoutView.as_view(next_page='login'),
        name='logout'
    ),

    path('signup/', views.signup, name='signup'),

    # DASHBOARD URLS
    path('dashboard/', include('dashboard.urls')),
   

]
