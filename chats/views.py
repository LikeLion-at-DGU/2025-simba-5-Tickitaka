from django.shortcuts import render

# Create your views here.
# chat/views.py
from django.shortcuts import render

def chat_room(request):
    return render(request, 'chats/chat_room.html')
def chat_list(request):
    return render(request, 'chats/chat_list.html')
