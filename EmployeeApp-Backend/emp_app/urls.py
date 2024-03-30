from django.urls import path
from emp_app import views

from .views import create_user, login


urlpatterns = [
    path('', views.index, name='index'),
    # path('all-emp/', views.allEmp, name='all-emp'),
    # path('all-emp', views.allEmp, name='all-emp'),
    path('create_user/', create_user, name='create_user_api'),
    path('login/', login, name='login_api'),
    path('add-emp', views.addEmp, name='add-emp'),
    path('remove-emp', views.removeEmp, name='remove-emp'),
    path('remove-emp/<int:empID>', views.removeEmp, name='remove-emp'),
    # path('filter-emp', views.filterEmp, name='filter-emp'),
]
