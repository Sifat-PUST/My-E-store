from .serializers import CatagorySerializer,ProductsSerializer,CartSerializer,CartItemSerializer,OrderSerializer,UserRegisterSerializer,UserLoginSerializer
from .models import Catagory,Products,Cart,CartItem,Order,OrderItem
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404 
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAuthenticatedOrReadOnly



from .throttles import OrderThrottle
# Create your views here.
class CatagroryView(APIView):
    def get(self, request):
        catagory = Catagory.objects.all()
        serializer = CatagorySerializer(catagory,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class ProductsViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer

class CartView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        cart=Cart.objects.get_or_create(user=request.user)[0]
        #many=True akadik object ar 
        # serializer = CartSerializer(cart,many=True)
        serializer = CartSerializer(cart)
        return Response(serializer.data,status=status.HTTP_200_OK)

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        #product_it and quantity come from frontend
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        cart,created = Cart.objects.get_or_create(user=request.user)

        # product=Products.objects.get(id=product_id)
        product =get_object_or_404(Products,id=product_id)
        if product:
            cart_item,created = CartItem.objects.get_or_create(cart=cart,product=product)
            cart_item.quantity += quantity
            cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data,status=status.HTTP_200_OK)

class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self,request):
        product_id = request.data.get('product_id')
        
        try:
            cart = Cart.objects.get(user=request.user)
            # product =get_object_or_404(Products,id=product_id)
            product = Products.objects.get(id=product_id)

        except Cart.DoesNotExist:
            return Response({"message":"Cart not found"},status=status.HTTP_404_NOT_FOUND)
        except Products.DoesNotExist:
            return Response({"message":"Product not found"},status=status.HTTP_404_NOT_FOUND)

        try:
            cart_item = CartItem.objects.get(cart=cart,product=product)
        except CartItem.DoesNotExist:
            return Response({"message":"Product not found in cart"},status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()
        return Response({"message":"Product removed from cart"},status=status.HTTP_200_OK)

class UpdateCartView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        cart,created = Cart.objects.get_or_create(user=request.user)

        # product=Products.objects.get(id=product_id)
        product =get_object_or_404(Products,id=product_id)
        if product:
            cart_item,created = CartItem.objects.get_or_create(cart=cart,product=product)
            cart_item.quantity = quantity
            cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data,status=status.HTTP_200_OK)

class OrderView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        order=Order.objects.all()
        serializer = OrderSerializer(order,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]
    # todo: Apply throttling for rate limiting
    throttle_classes = [OrderThrottle]
    def post(self,request):
        user = request.user if request.user.is_authenticated else None
        customer_name = request.data.get('customer_name')    
        phone= request.data.get('phone')
        address= request.data.get('address')
        email= request.data.get('email',None)
        payment_method= request.data.get('payment_method')
        cart = Cart.objects.get(user=None)
        # i want a process decrace the quantity of products as they are ordered

        total_amount= sum(item.product.price * item.quantity for item in cart.items.all())
        order=Order.objects.create(user=user,customer_name=customer_name,phone=phone,address=address,email=email,payment_method=payment_method,total_amount=total_amount)

        # todo: Create OrderItems
        for item in cart.items.all():
            OrderItem.objects.create(order=order,product=item.product,product_name=item.product.name,price=item.product.price,quantity=item.quantity)
        # Empty the cart after creating all order items
        cart.items.all().delete()
        serializer = OrderSerializer(order)
        return Response(serializer.data,status=status.HTTP_200_OK)

# for: Authentication
class UserRegistationView(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        serializer=UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
#todo: Login
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self,request): 
        serializer=UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            #note: .data= input data , .validated_data= processed data using validators
            return Response(serializer.validated_data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
