from rest_framework.throttling import UserRateThrottle
# todo: Apply throttling for rate limiting
class OrderThrottle(UserRateThrottle):
    scope = "order"