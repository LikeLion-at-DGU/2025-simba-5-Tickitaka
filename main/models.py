from django.db import models

class Event(models.Model):
    name = models.CharField(max_length=100)

class University(models.Model):
    name = models.CharField(max_length=100)

class Building(models.Model):
    name = models.CharField(max_length=100)
    university = models.ForeignKey(University, on_delete=models.CASCADE)
