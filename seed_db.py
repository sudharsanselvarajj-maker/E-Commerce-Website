from app import app, db
from models import User, Product
from werkzeug.security import generate_password_hash

def seed():
    with app.app_context():
        db.create_all()

        if User.query.filter_by(username='admin').first():
            print("Database already seeded.")
            return

        # Create Admin
        admin = User(username='admin', email='admin@fitgear.com', password_hash=generate_password_hash('admin123'), is_admin=True)
        user1 = User(username='john', email='john@example.com', password_hash=generate_password_hash('user123'), is_admin=False)
        
        db.session.add(admin)
        db.session.add(user1)

        # Create Products
        p1 = Product(name='Pro Football', category='football', price=29.99, stock=100, description='High quality match ball', image_url='https://placehold.co/400x400/1e1e1e/ff4757?text=Football')
        p2 = Product(name='Cricket Bat', category='cricket', price=149.99, stock=50, description='English Willow Grade A', image_url='https://placehold.co/400x400/1e1e1e/2ed573?text=Cricket')
        p3 = Product(name='Running Shoes', category='running', price=89.99, stock=200, description='Lightweight running shoes', image_url='https://placehold.co/400x400/1e1e1e/00a8ff?text=Running')
        p4 = Product(name='Gym Gloves', category='gym', price=19.99, stock=150, description='Breathable gym gloves with wrist support', image_url='https://placehold.co/400x400/1e1e1e/ffa502?text=Gym')
        
        db.session.add_all([p1, p2, p3, p4])
        db.session.commit()
        print("Database seeded!")

if __name__ == '__main__':
    seed()
