from django.db import models
from django.contrib.auth.models import User
#Creating models
class EVData(models.Model):
    year = models.IntegerField()
    state = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=100)
    make = models.CharField(max_length=100)
    electric_range = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.make} - {self.state}"

class UploadedCSV(models.Model):

    file = models.FileField(upload_to='uploads/')

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name

class Feedback(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    name = models.CharField(max_length=100)

    email = models.EmailField()

    message = models.TextField()

    rating = models.IntegerField(default=5)

    created_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(max_length=20, default='Pending')

    def __str__(self):
        return f"{self.name} - {self.rating}⭐"