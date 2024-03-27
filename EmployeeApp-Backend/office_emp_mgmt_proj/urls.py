"""office_emp_mgmt_proj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from emp_app.views import allEmp
from emp_app.views import getEmployee
from emp_app.views import addEmp
from emp_app.views import removeEmp
from emp_app.views import updateEmp
urlpatterns = [
     path('admin/', admin.site.urls),
    path('', include('emp_app.urls')),
    path('all-emp/', allEmp, name='all-emp'),  # Ensure this line is within the urlpatterns list
     path('get-emp/<int:empID>/', getEmployee, name='get-emp'),
    path('add-emp/', addEmp, name='add-emp'),
    path('delete-emp/<int:empID>/', removeEmp, name='delete-emp'),
    path('update-emp/<int:empID>/', updateEmp, name='update-emp'),
]
