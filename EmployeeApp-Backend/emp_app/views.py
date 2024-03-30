

from django.http import JsonResponse
from emp_app.models import Employee, Department, Role
from django.contrib import messages
from django.db.models import Q
from datetime import datetime
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from .models import User

# Your existing views

def index(request):
    return JsonResponse({'message': 'Welcome to the API backend.'})



@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Fetch the user based on the provided username
    user = User.objects.filter(username=username).first()
    if user:
        if user.check_password(password):
        # Password matches, generate token or perform any other authentication logic
        # For example, you can generate a token here and return it
        # user.generate_token()
        # Assuming you have a serializer for the user model
            user.generate_token()
            serializer = UserSerializer(user)
            response_data = {
                'user': serializer.data,
                'token': user.token  
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
        # Password does not match
            return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
    # User does not exist
        
    else:
        # User does not exist
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


    

def allEmp(request):
    if request.method == 'GET':
        employees = Employee.objects.all()
        data = [{'id': emp.pk, 'first_name': emp.first_name, 'last_name': emp.last_name, 'department': emp.dept.name, 'role': emp.role.name, 'salary': emp.salary, 'bonus': emp.bonus, 'phone_number': emp.phone_num, 'hire_date': emp.hire_date.strftime('%Y-%m-%d')} for emp in employees]
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)




@csrf_exempt
def addEmp(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        emp_id = data.get('id')  # Get the ID if provided

        # Delete existing employee if ID is provided
        if emp_id:
            try:
                emp = Employee.objects.get(emp_id=emp_id)
                emp.delete()
            except Employee.DoesNotExist:
                pass  # If the employee doesn't exist, continue to create a new one

        # Create a new employee
        firstname = data.get('first_name', '')  # Use default empty string if 'first_name' is not present
        lastname = data.get('last_name', '')  # Use default empty string if 'last_name' is not present
        emp_dept = data.get('department', None)  # Use None if 'department' is not present
        emp_role = data.get('role', None)  # Use None if 'role' is not present
        salary = data.get('salary', 0)  # Use default value 0 if 'salary' is not present
        bonus = data.get('bonus', 0)  # Use default value 0 if 'bonus' is not present
        phone = data.get('phone_number', '')  # Use default empty string if 'phone_number' is not present
        hire_date = data.get('hire_date', '')  # Use default empty string if 'hire_date' is not present

        if emp_dept and emp_role:
            try:
                dept = Department.objects.get(id=emp_dept)
                role = Role.objects.get(id=emp_role)
                emp = Employee(emp_id=emp_id, first_name=firstname, last_name=lastname, dept=dept, salary=salary, bonus=bonus, role=role, phone_num=phone, hire_date=hire_date)
                emp.save()
                return JsonResponse({'message': 'Employee added successfully.'}, status=201)
            except Department.DoesNotExist:
                return JsonResponse({'error': 'Department does not exist.'}, status=400)
            except Role.DoesNotExist:
                return JsonResponse({'error': 'Role does not exist.'}, status=400)
        else:
            return JsonResponse({'error': 'Department and Role are required.'}, status=400)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def removeEmp(request, empID=None):
    if request.method == 'POST':
        try:
            if empID:
                emp = Employee.objects.get(pk=empID)
                emp.delete()
                return JsonResponse({'message': 'Employee deleted successfully.'}, status=204)
            else:
                return JsonResponse({'error': 'Employee ID is required.'}, status=400)
        except Employee.DoesNotExist:
            return JsonResponse({'error': 'Employee not found.'}, status=404)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)


# def filterEmp(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         name = data.get('name')
#         dept = data.get('department')
#         role = data.get('role')

#         emp = Employee.objects.all()
#         if name:
#             emp = emp.filter(Q(first_name__icontains=name) | Q(last_name__icontains=name))
#         if dept:
#             emp = emp.filter(dept__id=dept)
#         if role:
#             emp = emp.filter(role__id=role)

#         data = [{'id': emp.id, 'first_name': emp.first_name, 'last_name': emp.last_name, 'department': emp.dept.name, 'role': emp.role.name, 'salary': emp.salary, 'bonus': emp.bonus, 'phone_number': emp.phone_num, 'hire_date': emp.hire_date.strftime('%Y-%m-%d')} for emp in emps]
#         return JsonResponse(data, safe=False)

#     return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def updateEmp(request, empID=None):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            employee = Employee.objects.get(pk=empID)
            
            # Update employee fields
            employee.first_name = data.get('first_name', employee.first_name)
            employee.last_name = data.get('last_name', employee.last_name)
            
            # Update department
            department_name = data.get('department')
            if department_name:
                department, created = Department.objects.get_or_create(name=department_name)
                employee.dept = department
            
            # Update other fields similarly
            
            employee.save()
            
            return JsonResponse({'message': 'Employee updated successfully.'}, status=200)
        except Employee.DoesNotExist:
            return JsonResponse({'error': 'Employee not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)
    

def getEmployee(request, empID=None):
    if request.method == 'GET':
        try:
            employee = Employee.objects.get(pk=empID)
            data = {
                'emp_id': employee.emp_id,
                'first_name': employee.first_name,
                'last_name': employee.last_name,
                'department': employee.dept.name,
                'role': employee.role.name,
                'salary': employee.salary,
                'bonus': employee.bonus,
                'phone_number': employee.phone_num,
                'hire_date': employee.hire_date.strftime('%Y-%m-%d')
            }
            return JsonResponse(data, status=200)
        except Employee.DoesNotExist:
            return JsonResponse({'error': 'Employee not found.'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)