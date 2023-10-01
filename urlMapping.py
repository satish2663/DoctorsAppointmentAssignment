from django.urls import path
from .views import DoctorList, DoctorDetail, AppointmentCreate

urlpatterns = [
    path('doctors/', DoctorList.as_view(), name='doctor-list'),
    path('doctors/<int:pk>/', DoctorDetail.as_view(), name='doctor-detail'),
    path('appointments/create/', AppointmentCreate.as_view(), name='appointment-create'),
]