from rest_framework import serializers
from .models import EVData


class EVDataSerializer(serializers.ModelSerializer):

    class Meta:

        model = EVData

        fields = '__all__'