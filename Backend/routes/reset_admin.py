from werkzeug.security import generate_password_hash

new_pass = "drbatman"  # change this
print("New hash:", generate_password_hash(new_pass))
