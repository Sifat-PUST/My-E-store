from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Catagory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True ,null=True,blank=True)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.user.username

class Products(models.Model):
    catagory = models.ForeignKey(Catagory,related_name='product', on_delete=models.CASCADE) 
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='product',blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveSmallIntegerField(default=1)
    available = models.BooleanField(default=True)
    created_by = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True,related_name='created_products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.catagory.name}"

class Cart(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    #todo: take cause: if i take total_price as db field then everytime when i change cartitem data(add to cart , update quantity , delete from cart) then total_price will also be updated. That means need to be updated cart using database qurary. 
    #todo: jokhon kono kico database a  save korer proijon porbe na tokhon @property ar modde ei vabe nite paro and ata ke database field hishabe treat kora jai.
    @property
    def total_price(self):
        return sum([item.product.price * item.quantity for item in self.items.all()])

    def __str__(self):
        return f"{self.id} - {self.total_price}"

class CartItem(models.Model):
    cart=models.ForeignKey(Cart,on_delete=models.CASCADE,related_name='items')
    product=models.ForeignKey(Products,on_delete=models.CASCADE,null=True,blank=True)
    # ! in view we add quantity from frontend to backend
    quantity=models.PositiveSmallIntegerField(default=0)


    def __str__(self):
        return f"{self.quantity} - {self.product.name}"

# todo: Order Model
from django.db import models
from django.contrib.auth.models import User


class Order(models.Model):

    # Payment Status
    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    # Order Status
    class OrderStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        PROCESSING = "processing", "Processing"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"

    # Payment Method
    class PaymentMethod(models.TextChoices):
        COD = "cod", "Cash on Delivery"
        BKASH = "bkash", "bKash"
        NAGAD = "nagad", "Nagad"
        CARD = "card", "Card"

    # Customer Information
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders"
    )

    customer_name = models.CharField(max_length=100,null=True,blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True,null=True)
    address = models.TextField()

    # Order Information
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.COD
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )

    order_status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        # todo: related_name="items" is used in serializer
        related_name="items"
    )

    product = models.ForeignKey(
        "Products",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_items"
    )

    # Product snapshot at purchase time
    product_name = models.CharField(max_length=100)

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

    @property
    def subtotal(self):
        return self.price * self.quantity
        