from rest_framework import generics
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentCreate(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer