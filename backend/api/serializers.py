from rest_framework import serializers
from .models import Catagory,Products,UserProfile,Cart,CartItem,Order,OrderItem
from django.contrib.auth.models import User
# import refresh token
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
class CatagorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Catagory
        fields = '__all__'

class ProductsSerializer(serializers.ModelSerializer):
    #PrimaryKeyRelatedField → Related object-এর ID দিয়ে সম্পর্ক তৈরি বা update করা।
    #queryset → কোন Related object-গুলো valid হবে তা নির্ধারণ করা।
    #PrimaryKeyRelatedField হলো API Serializer-এর কাজ। এটি Admin Panel-এর dropdown তৈরি করার জন্য নয়।
    catagory = serializers.PrimaryKeyRelatedField(queryset=Catagory.objects.all(),write_only=True)
    category_details = CatagorySerializer(source='catagory',read_only=True)
    # তুমি যদি source='catagory' না দিতে, তাহলে category_details field-টি তোমার Model-এর catagory field-এর সঙ্গে যুক্ত হতো না। বরং Django REST Framework Products model-এর মধ্যে category_details নামে একটি field খুঁজত

    owner = UserSerializer(source='created_by',read_only=True)
    class Meta:
        model = Products
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    # product=ProductsSerializer(read_only=True) or
    product_name = serializers.ReadOnlyField(source='product.name')
    product_price= serializers.ReadOnlyField(source='product.price')
    product_image = serializers.ImageField(source='product.image',read_only=True)
    class Meta:
        model = CartItem
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    # if need nested cartitem into cart then must have to wirite items from related_name('items') cause use in CartItem Model not cartitem
    #Cart model ar bitor kono filed ar nam cartitem nai 
    items = CartItemSerializer(many=True,read_only=True)
    # cartitem = CartItemSerializer(many=True,read_only=True)

    #take cause: total price need and Cart model a @property te ase tai ei vabe likha jai.
    total_price = serializers.ReadOnlyField()
    class Meta:
        model = Cart
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_price= serializers.ReadOnlyField(source='product.price')
    quantity = serializers.ReadOnlyField()
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    # todo: name should be items not orderitems cause use in OrderItem Model as related_name
    items = OrderItemSerializer(many=True,read_only=True)
    class Meta:
        model = Order
        fields = '__all__' 

# for:User Registation Serialaizer 
#note: amra chile View+Model use kore o same kaj ta korte pari . ata just shiker jonne kivabe serializer use kore korte hoi

class UserRegisterSerializer(serializers.ModelSerializer):
    # note: frontend thake data serialise a pass hole  nicher varibale golo match kora varibale golo ke catch kore falbe
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model=User
        fields=('id','username','email','password','password2')

    # todo: validate ar por jei filed k validate korte chccahi oi field ar name dite hoi
    def validate_username(self,data):
        if User.objects.filter(username=data).exists():
            raise serializers.ValidationError("User already exists")
        return data

    def validate_email(self,data):
        if User.objects.filter(email=data).exists():
            raise serializers.ValidationError("Email already exists")
        return data

    #todo : validate ar por name na dile nicher process a hoi
    def validate(self,data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Password does not match")
        return data

    # todo: request view the asher por  data seiraliser a pathabe and then view isValid pawer por {serializer.save()} korle create method call hobe
    def create(self,validated_data):
        user=User.objects.create_user(validated_data['username'],validated_data['email'],validated_data['password'])
        return user

# todo: User Login Serialaizer
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    # class Meta:
    #     model=User
    #     # note: jei jei filed k validate korte chccahi oi field ar name dite hoi must
    #     # ! ei akhane Mention kora mane ei ta na je ei eikhaner shob field ei Response a jabe 
    #     fields=('id','username','email','password') --> username in User is unique so when login api call its return user with this user name Exist.
    # for: use serializer.Serializer instead of ModelSerializer

    def validate(self, data):
        user=User.objects.filter(username=data['username']).first()
        if user is None:
            raise serializers.ValidationError("User does not exist")

        if not user.check_password(data['password']):
            raise serializers.ValidationError("Password does not match")

        refresh = RefreshToken.for_user(user)
        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        

   
    