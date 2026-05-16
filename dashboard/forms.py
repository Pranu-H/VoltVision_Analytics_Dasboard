from django import forms
from .models import UploadedCSV

from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class CSVUploadForm(forms.ModelForm):

    class Meta:
        model = UploadedCSV
        fields = ['file']


class StyledUserCreationForm(UserCreationForm):

    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Email'
        })
    )

    class Meta:
        model = User

        fields = (
            'username',
            'email',
            'password1',
            'password2'
        )

    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)

        self.fields['username'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Username'
        })

        self.fields['password1'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Password'
        })

        self.fields['password2'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Confirm Password'
        })