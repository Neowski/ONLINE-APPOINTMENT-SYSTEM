"""
URL configuration for OnlineAppointmentSystem project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.contrib import admin
from django.urls import path

from users.views import (
    login_view,
    AdviserAvailabilityListCreateView,
    AdviserAvailabilityDetailView,
    AppointmentListCreateView,
    AppointmentDetailView,
    AdviserListView,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', login_view, name='login'),
    path('api/adviser-availability/', AdviserAvailabilityListCreateView.as_view(), name='adviser-availability-list-create'),
    path('api/adviser-availability/<int:pk>/', AdviserAvailabilityDetailView.as_view(), name='adviser-availability-detail'),
    path('api/appointments/', AppointmentListCreateView.as_view(), name='appointment-list'),
    path('api/appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),

    path('api/advisers/', AdviserListView.as_view(), name='adviser-list'),

]
