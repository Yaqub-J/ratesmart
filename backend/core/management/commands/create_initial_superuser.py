from django.core.management.base import BaseCommand
from core.models import Business

class Command(BaseCommand):
    help = 'Creates an initial superuser'

    def handle(self, *args, **options):
        try:
            email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
            password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
            
            if not email or not password:
                self.stdout.write(self.style.ERROR('Email and password must be set in environment variables'))
                return

            if not Business.objects.filter(email=email).exists():
                Business.objects.create_superuser(
                    email=email,
                    name='Admin',
                    password=password,
                    phone='1234567890',
                    country='US',
                    state='CA',
                    hours='9-5'
                )
                self.stdout.write(self.style.SUCCESS(f'Successfully created superuser with email {email}'))
            else:
                self.stdout.write(self.style.WARNING(f'Superuser with email {email} already exists'))