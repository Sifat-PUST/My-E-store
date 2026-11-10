from django.urls import path,include
from rest_framework import routers
from .views import CatagroryView,ProductsViewSet,AddToCartView,CartView,RemoveFromCartView,UpdateCartView,CreateOrderView,OrderView,UserRegistationView,LoginView


router= routers.DefaultRouter()
router.register('product',ProductsViewSet,basename='product')
urlpatterns = [
    path('',include(router.urls)),
    path('register/',UserRegistationView.as_view(),name='register'),
    path('login/',LoginView.as_view(),name='login'),
    path('catagory/',CatagroryView.as_view(),name='catagory'),
    path('cart/',CartView.as_view(),name='cart'),
    path('add-to-cart/',AddToCartView.as_view(),name='add-to-cart'),
    path('remove-from-cart/',RemoveFromCartView.as_view(),name='remove-from-cart'),
    path('update-cart/',UpdateCartView.as_view(),name='update-cart'),
    path('orders/',OrderView.as_view(),name='orders'),
    path('create-order/',CreateOrderView.as_view(),name='create-order'),
]
