from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api_root'),
    path('signup/', views.signup_business, name='signup_business'),
    path('login/', views.login_business, name='login_business'),
    path('businesses/me/', views.current_business, name='current_business'),
    path('businesses/', views.business_list_create, name='business_list_create'),
    path('businesses/<int:pk>/', views.business_detail, name='business_detail'),
    path('businesses/search/', views.business_search, name='business_search'),
    path('products/', views.product_list_create, name='product_list_create'),
    path('products/<int:pk>/', views.product_detail, name='product_detail'),
    path('products/business/<int:business_id>/', views.business_products, name='business_products'),
    path('reviews/', views.review_list_create, name='review_list_create'),
    path('reviews/<int:pk>/', views.review_detail, name='review_detail'),
    path('reviews/product/<int:product_id>/', views.product_reviews, name='product_reviews'),
    path('reviews/business/<int:business_id>/', views.business_reviews, name='business_reviews'),
    path('admin/reset/', views.reset_system, name='reset_system'),
]