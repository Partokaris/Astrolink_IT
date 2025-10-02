import json
from app import app


def run_test():
    client = app.test_client()
    payload = {
        'customer_name': 'Test User',
        'customer_email': 'test@example.com',
        'shipping_address': '123 Test Lane',
        'items': [{'id': 1, 'name': 'Sample', 'price': '9.99', 'qty': 1}],
        'total': 9.99
    }
    resp = client.post('/api/orders/', data=json.dumps(payload), content_type='application/json')
    print('Status:', resp.status_code)
    print('Body:', resp.get_data(as_text=True))


if __name__ == '__main__':
    run_test()
