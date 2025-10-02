from flask import Blueprint, request, jsonify, current_app
from extensions import mysql
from flask_jwt_extended import jwt_required, get_jwt
from MySQLdb.cursors import DictCursor
import json

orders_bp = Blueprint('orders', __name__)


@orders_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json() or {}
    customer_name = data.get('customer_name')
    customer_email = data.get('customer_email')
    shipping_address = data.get('shipping_address')
    items = data.get('items')
    total = data.get('total')

    if not customer_name or not customer_email or not items:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO orders (customer_name, customer_email, shipping_address, items, total) VALUES (%s, %s, %s, %s, %s)",
            (customer_name, customer_email, shipping_address, json.dumps(items), total)
        )
        mysql.connection.commit()
        order_id = cur.lastrowid
        cur.close()
        return jsonify({'message': 'Order created', 'order_id': order_id}), 201
    except Exception as e:
        current_app.logger.exception('Failed to create order')
        return jsonify({'error': 'Failed to create order', 'detail': str(e)}), 500


@orders_bp.route('/', methods=['GET'])
@jwt_required()
def list_orders():
    claims = get_jwt()
    if int(claims.get('role_id', 0)) not in (1, 2):
        return jsonify({'error': 'Access denied'}), 403

    limit = int(request.args.get('limit', 50))
    status = request.args.get('status')
    try:
        cur = mysql.connection.cursor(DictCursor)
        if status:
            cur.execute(
                "SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE status=%s ORDER BY created_at DESC LIMIT %s",
                (status, limit),
            )
        else:
            cur.execute(
                "SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT %s",
                (limit,),
            )
        rows = cur.fetchall()
        orders = []
        for obj in rows:
            try:
                obj['items'] = json.loads(obj.get('items') or '[]')
            except Exception:
                obj['items'] = []
            orders.append(obj)
        cur.close()
        return jsonify({'orders': orders})
    except Exception as e:
        current_app.logger.exception('Failed to list orders')
        return jsonify({'error': 'Failed to list orders', 'detail': str(e)}), 500


@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    claims = get_jwt()
    if int(claims.get('role_id', 0)) not in (1, 2):
        return jsonify({'error': 'Access denied'}), 403
    try:
        cur = mysql.connection.cursor(DictCursor)
        cur.execute(
            "SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE id=%s",
            (order_id,),
        )
        obj = cur.fetchone()
        if not obj:
            cur.close()
            return jsonify({'error': 'Order not found'}), 404
        try:
            obj['items'] = json.loads(obj.get('items') or '[]')
        except Exception:
            obj['items'] = []
        cur.close()
        return jsonify({'order': obj})
    except Exception as e:
        current_app.logger.exception('Failed to get order')
        return jsonify({'error': 'Failed to get order', 'detail': str(e)}), 500


@orders_bp.route('/<int:order_id>', methods=['PATCH'])
@jwt_required()
def update_order(order_id):
    claims = get_jwt()
    if int(claims.get('role_id', 0)) not in (1, 2):
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json() or {}
    status = data.get('status')
    customer_name = data.get('customer_name')
    customer_email = data.get('customer_email')
    shipping_address = data.get('shipping_address')

    if not any([status, customer_name, customer_email, shipping_address]):
        return jsonify({'error': 'No fields to update'}), 400

    try:
        cur = mysql.connection.cursor()
        updates = []
        params = []
        if status is not None:
            updates.append('status=%s')
            params.append(status)
        if customer_name is not None:
            updates.append('customer_name=%s')
            params.append(customer_name)
        if customer_email is not None:
            updates.append('customer_email=%s')
            params.append(customer_email)
        if shipping_address is not None:
            updates.append('shipping_address=%s')
            params.append(shipping_address)

        params.append(order_id)
        sql = f"UPDATE orders SET {', '.join(updates)} WHERE id=%s"
        cur.execute(sql, tuple(params))
        mysql.connection.commit()

        cur = mysql.connection.cursor(DictCursor)
        cur.execute(
            "SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE id=%s",
            (order_id,),
        )
        obj = cur.fetchone()
        if obj:
            try:
                obj['items'] = json.loads(obj.get('items') or '[]')
            except Exception:
                obj['items'] = []
        cur.close()
        return jsonify({'message': 'Order updated', 'order': obj})
    except Exception as e:
        current_app.logger.exception('Failed to update order')
        return jsonify({'error': 'Failed to update order', 'detail': str(e)}), 500
from flask import Blueprint, request, jsonify, current_app
from extensions import mysql
from flask_jwt_extended import jwt_required, get_jwt
from MySQLdb.cursors import DictCursor
import json

orders_bp = Blueprint('orders', __name__)


@orders_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json() or {}
    customer_name = data.get('customer_name')
    customer_email = data.get('customer_email')
    shipping_address = data.get('shipping_address')
    items = data.get('items')
    total = data.get('total')

    if not customer_name or not customer_email or not items:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO orders (customer_name, customer_email, shipping_address, items, total) VALUES (%s, %s, %s, %s, %s)",
            (customer_name, customer_email, shipping_address, json.dumps(items), total)
        )
        mysql.connection.commit()
        order_id = cur.lastrowid
        cur.close()
        return jsonify({'message': 'Order created', 'order_id': order_id}), 201
    except Exception as e:
        current_app.logger.exception('Failed to create order')
        return jsonify({'error': 'Failed to create order', 'detail': str(e)}), 500


@orders_bp.route('/', methods=['GET'])
@jwt_required()
def list_orders():
    claims = get_jwt()
    if int(claims.get('role_id', 0)) not in (1, 2):
        return jsonify({'error': 'Access denied'}), 403

    limit = int(request.args.get('limit', 50))
    status = request.args.get('status')
    try:
        cur = mysql.connection.cursor(DictCursor)
        if status:
            cur.execute(
                "SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE status=%s ORDER BY created_at DESC LIMIT %s",
                (status, limit),
            )
        else:
            cur.execute(
                "SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT %s",
                (limit,),
            )
        rows = cur.fetchall()
        orders = []
        for obj in rows:
            try:
                obj['items'] = json.loads(obj.get('items') or '[]')
            except Exception:
                obj['items'] = []
            orders.append(obj)
        cur.close()
        return jsonify({'orders': orders})
    except Exception as e:
        current_app.logger.exception('Failed to list orders')
        return jsonify({'error': 'Failed to list orders', 'detail': str(e)}), 500


@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    claims = get_jwt()
    if int(claims.get('role_id', 0)) not in (1, 2):
        return jsonify({'error': 'Access denied'}), 403
    try:
        cur = mysql.connection.cursor(DictCursor)
        cur.execute(
            "SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE id=%s",
            (order_id,),
        )
        obj = cur.fetchone()
        if not obj:
            cur.close()
            return jsonify({'error': 'Order not found'}), 404
        try:
            obj['items'] = json.loads(obj.get('items') or '[]')
        except Exception:
            obj['items'] = []
        cur.close()
        return jsonify({'order': obj})
    except Exception as e:
        current_app.logger.exception('Failed to get order')
        return jsonify({'error': 'Failed to get order', 'detail': str(e)}), 500


@orders_bp.route('/<int:order_id>', methods=['PATCH'])
@jwt_required()
def update_order(order_id):
    claims = get_jwt()
    if int(claims.get('role_id', 0)) not in (1, 2):
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json() or {}
    status = data.get('status')
    customer_name = data.get('customer_name')
    customer_email = data.get('customer_email')
    shipping_address = data.get('shipping_address')

    if not any([status, customer_name, customer_email, shipping_address]):
        return jsonify({'error': 'No fields to update'}), 400

    try:
        cur = mysql.connection.cursor()
        updates = []
        params = []
        if status is not None:
            updates.append('status=%s')
            params.append(status)
        if customer_name is not None:
            updates.append('customer_name=%s')
            params.append(customer_name)
        if customer_email is not None:
            updates.append('customer_email=%s')
            params.append(customer_email)
        if shipping_address is not None:
            updates.append('shipping_address=%s')
            params.append(shipping_address)

        params.append(order_id)
        sql = f"UPDATE orders SET {', '.join(updates)} WHERE id=%s"
        cur.execute(sql, tuple(params))
        mysql.connection.commit()

        cur = mysql.connection.cursor(DictCursor)
        cur.execute(
            "SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE id=%s",
            (order_id,),
        )
        obj = cur.fetchone()
        if obj:
            try:
                obj['items'] = json.loads(obj.get('items') or '[]')
            except Exception:
                obj['items'] = []
        cur.close()
        return jsonify({'message': 'Order updated', 'order': obj})
    except Exception as e:
        current_app.logger.exception('Failed to update order')
        return jsonify({'error': 'Failed to update order', 'detail': str(e)}), 500
from flask import Blueprint, request, jsonify, current_app
from extensions import mysql
from flask_jwt_extended import jwt_required, get_jwt
from MySQLdb.cursors import DictCursor
from flask import Blueprint, request, jsonify, current_app
from extensions import mysql
from flask_jwt_extended import jwt_required, get_jwt
from MySQLdb.cursors import DictCursor
import json

orders_bp = Blueprint('orders', __name__)


@orders_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json() or {}
    customer_name = data.get('customer_name')
    customer_email = data.get('customer_email')
    shipping_address = data.get('shipping_address')
    items = data.get('items')
    total = data.get('total')

    if not customer_name or not customer_email or not items:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO orders (customer_name, customer_email, shipping_address, items, total) VALUES (%s, %s, %s, %s, %s)",
            (customer_name, customer_email, shipping_address, json.dumps(items), total)
        )
        mysql.connection.commit()
        order_id = cur.lastrowid
        cur.close()
        return jsonify({'message': 'Order created', 'order_id': order_id}), 201
    except Exception as e:
        current_app.logger.exception('Failed to create order')
        return jsonify({'error': 'Failed to create order', 'detail': str(e)}), 500



@orders_bp.route('/', methods=['GET'])
@jwt_required()
def list_orders():
    claims = get_jwt()
    if int(claims.get('role_id', 0)) not in (1, 2):
        return jsonify({'error': 'Access denied'}), 403

    limit = int(request.args.get('limit', 50))
    status = request.args.get('status')
    try:
        cur = mysql.connection.cursor(DictCursor)
        if status:
            cur.execute(
                "SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE status=%s ORDER BY created_at DESC LIMIT %s",
                (status, limit)
            )
        else:
            cur.execute(
                "SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT %s",
                (limit,)
            )
        rows = cur.fetchall()
        orders = []
        for obj in rows:
            try:
                obj['items'] = json.loads(obj.get('items') or '[]')
            except Exception:
                obj['items'] = []
            orders.append(obj)
        cur.close()
        return jsonify({'orders': orders})
    except Exception as e:
        current_app.logger.exception('Failed to list orders')
        return jsonify({'error': 'Failed to list orders', 'detail': str(e)}), 500



@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    claims = get_jwt()
    if int(claims.get('role_id', 0)) not in (1, 2):
        return jsonify({'error': 'Access denied'}), 403
    try:
        cur = mysql.connection.cursor(DictCursor)
        cur.execute(
            "SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE id=%s",
            (order_id,)
        )
        obj = cur.fetchone()
        if not obj:
            cur.close()
            return jsonify({'error': 'Order not found'}), 404
        try:
            obj['items'] = json.loads(obj.get('items') or '[]')
        except Exception:
            obj['items'] = []
        cur.close()
        return jsonify({'order': obj})
    except Exception as e:
        current_app.logger.exception('Failed to get order')
        return jsonify({'error': 'Failed to get order', 'detail': str(e)}), 500



@orders_bp.route('/<int:order_id>', methods=['PATCH'])
@jwt_required()
def update_order(order_id):
    claims = get_jwt()
    if int(claims.get('role_id', 0)) not in (1, 2):
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json() or {}
    status = data.get('status')
    customer_name = data.get('customer_name')
    customer_email = data.get('customer_email')
    shipping_address = data.get('shipping_address')

    if not any([status, customer_name, customer_email, shipping_address]):
        return jsonify({'error': 'No fields to update'}), 400

    try:
        cur = mysql.connection.cursor()
        updates = []
        params = []
        if status is not None:
            updates.append('status=%s')
            params.append(status)
        if customer_name is not None:
            updates.append('customer_name=%s')
            params.append(customer_name)
        if customer_email is not None:
            updates.append('customer_email=%s')
            params.append(customer_email)
        if shipping_address is not None:
            updates.append('shipping_address=%s')
            params.append(shipping_address)

        params.append(order_id)
        sql = f"UPDATE orders SET {', '.join(updates)} WHERE id=%s"
        cur.execute(sql, tuple(params))
        mysql.connection.commit()

        cur = mysql.connection.cursor(DictCursor)
        cur.execute(
            "SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE id=%s",
            (order_id,)
        )
        obj = cur.fetchone()
        if obj:
            try:
                obj['items'] = json.loads(obj.get('items') or '[]')
            except Exception:
                obj['items'] = []
        cur.close()
        return jsonify({'message': 'Order updated', 'order': obj})
    except Exception as e:
        current_app.logger.exception('Failed to update order')
        return jsonify({'error': 'Failed to update order', 'detail': str(e)}), 500

                obj['items'] = []
        cur.close()
        return jsonify({'message': 'Order updated', 'order': obj})
    except Exception as e:
        current_app.logger.exception('Failed to update order')
        return jsonify({'error': 'Failed to update order', 'detail': str(e)}), 500

        # return the updated order
        cur = mysql.connection.cursor(DictCursor)
        cur.execute("SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE id=%s", (order_id,))
        obj = cur.fetchone()
        if obj:
            try:
                obj['items'] = json.loads(obj.get('items') or '[]')
            except Exception:
                obj['items'] = []
        cur.close()
        return jsonify({'message': 'Order updated', 'order': obj})
    except Exception as e:
        current_app.logger.exception('Failed to update order')
        return jsonify({'error': 'Failed to update order', 'detail': str(e)}), 500

                obj['items'] = []
        cur.close()
        return jsonify({'message': 'Order updated', 'order': obj})
    except Exception as e:
        current_app.logger.exception('Failed to update order')
        return jsonify({'error': 'Failed to update order', 'detail': str(e)}), 500
from flask import Blueprint, request, jsonify, current_app
from extensions import mysql
from flask_jwt_extended import jwt_required, get_jwt
from MySQLdb.cursors import DictCursor
import json

orders_bp = Blueprint('orders', __name__)


@orders_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json() or {}
    customer_name = data.get('customer_name')
    customer_email = data.get('customer_email')
    shipping_address = data.get('shipping_address')
    items = data.get('items')
    total = data.get('total')

    if not customer_name or not customer_email or not items:
        return jsonify({'error': 'Missing required fields'}), 400

        cur.close()
        return jsonify({'orders': orders})
    except Exception as e:
        current_app.logger.exception('Failed to list orders')
        return jsonify({'error': 'Failed to list orders', 'detail': str(e)}), 500


@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    claims = get_jwt()
    if int(claims.get('role_id', 0)) not in (1, 2):
        return jsonify({'error': 'Access denied'}), 403
    try:
        cur = mysql.connection.cursor(DictCursor)
        cur.execute("SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE id=%s", (order_id,))
        obj = cur.fetchone()
        if not obj:
            cur.close()
            return jsonify({'error': 'Order not found'}), 404
        try:
            obj['items'] = json.loads(obj.get('items') or '[]')
        except Exception:
            obj['items'] = []
        cur.close()
        return jsonify({'order': obj})
    except Exception as e:
        current_app.logger.exception('Failed to get order')
        return jsonify({'error': 'Failed to get order', 'detail': str(e)}), 500
            cur.execute("SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE status=%s ORDER BY created_at DESC LIMIT %s", (status, limit))
        else:
            cur.execute("SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT %s", (limit,))
        rows = cur.fetchall()
        orders = []
        for obj in rows:
            try:
                obj['items'] = json.loads(obj.get('items') or '[]')
            except Exception:
                obj['items'] = []
            orders.append(obj)
        cur.close()
        return jsonify({'orders': orders})
    except Exception as e:
        current_app.logger.exception('Failed to list orders')
        return jsonify({'error': 'Failed to list orders', 'detail': str(e)}), 500




    @orders_bp.route('/<int:order_id>', methods=['GET'])
    @jwt_required()
    def get_order(order_id):
        claims = get_jwt()
        if int(claims.get('role_id', 0)) not in (1, 2):
            return jsonify({'error': 'Access denied'}), 403
        try:
            cur = mysql.connection.cursor(DictCursor)
            cur.execute("SELECT id, customer_name, customer_email, shipping_address, items, total, status, created_at FROM orders WHERE id=%s", (order_id,))
            obj = cur.fetchone()
            if not obj:
                cur.close()
                return jsonify({'error': 'Order not found'}), 404
            try:
                obj['items'] = json.loads(obj.get('items') or '[]')
            except Exception:
                obj['items'] = []
            cur.close()
            return jsonify({'order': obj})
        except Exception as e:
            current_app.logger.exception('Failed to get order')
            return jsonify({'error': 'Failed to get order', 'detail': str(e)}), 500



@orders_bp.route('/<int:order_id>', methods=['PATCH'])
@jwt_required()
def update_order(order_id):
    # only admin or super_admin
    claims = get_jwt()
    if int(claims.get('role_id', 0)) not in (1, 2):
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json() or {}
    # accept partial updates for status, customer_name, customer_email, shipping_address
    status = data.get('status')
    customer_name = data.get('customer_name')
    customer_email = data.get('customer_email')
    shipping_address = data.get('shipping_address')

    # At least one field should be provided
    if not any([status, customer_name, customer_email, shipping_address]):
        return jsonify({'error': 'No fields to update'}), 400

    try:
        cur = mysql.connection.cursor()
        # build dynamic update
        updates = []
        params = []
        if status is not None:
            updates.append('status=%s')
            params.append(status)
        if customer_name is not None:
            updates.append('customer_name=%s')
            params.append(customer_name)
        if customer_email is not None:
            updates.append('customer_email=%s')
            params.append(customer_email)
        if shipping_address is not None:
            updates.append('shipping_address=%s')
            params.append(shipping_address)

        params.append(order_id)
        sql = f"UPDATE orders SET {', '.join(updates)} WHERE id=%s"
        cur.execute(sql, tuple(params))
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'Order updated'})
    except Exception as e:
        current_app.logger.exception('Failed to update order')
        return jsonify({'error': 'Failed to update order', 'detail': str(e)}), 500
