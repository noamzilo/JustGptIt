#!/bin/bash

# Function to start the server
start_server() {
    echo "Starting Django server..."
    (cd backend && source ../venv/bin/activate && python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000)
}

# Function to stop the server
stop_server() {
    echo "Stopping Django server..."
    pkill -f "python manage.py runserver"
}

# Main script logic
case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        stop_server
        start_server
        ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
        ;;
esac

exit 0