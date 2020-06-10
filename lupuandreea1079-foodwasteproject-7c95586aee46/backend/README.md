Pentru partea de backend, s-a folosit Sequelize.
Baza de date are 3 tabele:
Users -tabela utilizatorilor
Items -tabela de food items cu food item generice din care userii pot alege
UsersItem -tabela cu food items ale fiecarui user; s-a folosit o alta tabela pt ca are in plus proprietatea "quantity"
Friends -tabela prietenilor utilizatorilor cu proprietatea de "category"; aceasta este legata de Users (Users.hasMany(Friends))

Metodele generice sunt comentate in cod.
