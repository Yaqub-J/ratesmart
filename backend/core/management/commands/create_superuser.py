from django.db import IntegrityError
from core.models import Business
import os

def create_superuser():
    try:
        email = os.getenv('DJANGO_SUPERUSER_EMAIL')
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD')
        name = os.getenv('DJANGO_SUPERUSER_NAME', 'Admin')
        phone = os.getenv('DJANGO_SUPERUSER_PHONE', '1234567890')
        country = os.getenv('DJANGO_SUPERUSER_COUNTRY', 'US')
        state = os.getenv('DJANGO_SUPERUSER_STATE', 'CA')
        hours = os.getenv('DJANGO_SUPERUSER_HOURS', '9-5')

        if not email or not password:
            print('Superuser creation skipped: email and password must be set in environment variables')
            return False

        try:
            if Business.objects.filter(email=email).exists():
                print(f'Superuser {email} already exists')
                return False

            Business.objects.create_superuser(
                email=email,
                password=password,
                name=name,
                phone=phone,
                country=country,
                state=state,
                hours=hours
            )
            print(f'Superuser {email} created successfully')
            return True
        except IntegrityError:
            print(f'Superuser creation failed: {email} might already exist')
            return False

    except Exception as e:
        print(f'Superuser creation failed: {str(e)}')
        return False