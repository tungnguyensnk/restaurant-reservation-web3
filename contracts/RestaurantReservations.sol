// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract RestaurantReservations {
    uint32 private counterReservations;
    uint16 private counterMenuItems;
    uint16 private counterReviews;
    uint32 private counterTables;
    address private owner;
    constructor() {
        owner = msg.sender;
        role[msg.sender] = 2;
        counterReservations = 0;
        counterMenuItems = 0;
        counterReviews = 0;
        counterTables = 0;
    }

    // Events
    event ReservationAdded(address indexed customer, uint reservationId);
    event ReservationCancelled(address indexed customer, uint reservationId);
    event PaymentReceived(address indexed customer, uint reservationId, uint amount);
    event ReservationStatusChanged(address indexed customer, uint reservationId, ReservationStatus status);
    event ReviewAdded(address indexed customer, uint reviewId);
    event removeItem(uint id, string name, uint32 price, bool isAvailable, string description);
    event MenuItemAdded(uint id, string name, uint32 price, bool isAvailable, string description);
    event updateItem(uint id, string name, uint32 price, bool isAvailable, string description);
    event TableAdded(uint32 id);

    // Enums
    enum ReservationStatus {
        Pending,
        Paid,
        Confirmed,
        Cancelled,
        Completed
    }

    // Structs
    struct Item {
        uint16 id;
        uint16 quantity;
    }

    struct Reservation {
        uint32 id;
        address customer;
        uint32 timestampReservation;
        uint32 timestampEat;
        uint16 numberOfPeople;
        uint8[] chairsReserved;
        Item[] listItems;
        ReservationStatus status;
        string specialRequest;
    }

    struct MenuItem {
        uint16 id;
        string name;
        uint32 price;
        bool isAvailable;
        string description;
    }

    struct Review {
        uint16 id;
        uint32 reservationId;
        address customer;
        uint8 rating;
        string comment;
    }

    // Mapping
    mapping(address => uint) public points;
    mapping(uint32 => bool) public tables; // true = reserved, false = available
    mapping(uint => Reservation) public reservations;
    mapping(uint => MenuItem) public menuItems;
    mapping(uint => Review) public reviews;
    mapping(address => uint) public role; // 0 = customer, 1 = restaurant, 2 = admin

    // Modifiers
    modifier onlyCustomer(uint _reservationId) {
        require(msg.sender == reservations[_reservationId].customer, "Only customer can call this function");
        _;
    }

    modifier onlyRestaurant() {
        require(role[msg.sender] == 1 || role[msg.sender] == 2, "Only restaurant or admin can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(role[msg.sender] == 2, "Only admin can call this function");
        _;
    }

    modifier validItems(Item[] memory _listItems) {
        for (uint i = 0; i < _listItems.length; i++) {
            require(_listItems[i].id > 0 && _listItems[i].id <= counterMenuItems, "Item id must be between 1 and number of menu items");
            require(_listItems[i].quantity > 0, "Item quantity must be greater than 0");
            require(menuItems[_listItems[i].id].isAvailable == true, "Item is not available");
        }
        _;
    }

    modifier validReservation(uint _reservationId) {
        require(_reservationId > 0 && _reservationId <= counterReservations, "Reservation id must be between 1 and number of reservations");
        _;
    }

    // Getters
    // Get info of a reservation
    function getReservation(uint _reservationId)
    public validReservation(_reservationId) view returns (Reservation memory) {
        return reservations[_reservationId];
    }

    // Get all reservations
    function getAllReservations() public view returns (Reservation[] memory) {
        Reservation[] memory listReservations = new Reservation[](counterReservations);
        for (uint i = 0; i < counterReservations; i++) {
            Reservation storage reservation = reservations[i + 1];
            listReservations[i] = reservation;
        }
        return listReservations;
    }

    // Get all reservations of a customer
    function getAllReservationsOfCustomer(address _customer) public view returns (Reservation[] memory) {
        Reservation[] memory listReservations = new Reservation[](counterReservations);
        uint counter = 0;
        for (uint i = 0; i < counterReservations; i++) {
            if (reservations[i + 1].customer == _customer) {
                Reservation storage reservation = reservations[i + 1];
                listReservations[counter] = reservation;
                counter++;
            }
        }
        return listReservations;
    }
    // Setters

    // Functions

    // Add a reservation
    function addReservation(
        uint32 _timestampReservation, uint32 _timestampEat, uint16 _numberOfPeople, uint8[] memory _tablesReserved,
        Item[] memory _listItems, string memory _specialRequest
    ) public validItems(_listItems) {
        require(_numberOfPeople > 0, "Number of people must be greater than 0");
        require(_timestampEat > _timestampReservation, "Eat time must be after reservation time");
        require(_timestampEat - _timestampReservation >= 3600, "Eat time must be at least 1 hour after reservation time");
        require(_timestampEat - _timestampReservation <= 86400 * 7, "Eat time must be at most 7 days after reservation time");
        require(_tablesReserved.length * 6 >= _numberOfPeople, "Not enough chairs for the number of people");

        for (uint i = 0; i < _tablesReserved.length; i++) {
            require(_tablesReserved[i] > 0 && _tablesReserved[i] <= counterTables, "Tables number must be between 1 and number of tables");
            require(tables[_tablesReserved[i]] == false, "Chair is already reserved");
        }

        for (uint i = 0; i < _tablesReserved.length; i++) {
            tables[_tablesReserved[i]] = true;
        }
        counterReservations++;
        Reservation storage reservation = reservations[counterReservations];
        reservation.id = counterReservations;
        reservation.customer = msg.sender;
        reservation.timestampReservation = _timestampReservation;
        reservation.timestampEat = _timestampEat;
        reservation.numberOfPeople = _numberOfPeople;
        reservation.chairsReserved = _tablesReserved;
        reservation.status = ReservationStatus.Pending;
        reservation.specialRequest = _specialRequest;

        for (uint i = 0; i < _listItems.length; i++) {
            reservation.listItems.push(_listItems[i]);
        }

        emit ReservationAdded(msg.sender, reservation.id);
    }

    // Cancel a reservation
    function cancelReservation(uint _reservationId)
    public validReservation(_reservationId) onlyCustomer(_reservationId) {
        require(reservations[_reservationId].status == ReservationStatus.Pending, "Reservation is not pending");
        for (uint i = 0; i < reservations[_reservationId].chairsReserved.length; i++) {
            tables[reservations[_reservationId].chairsReserved[i]] = false;
        }
        reservations[_reservationId].status = ReservationStatus.Cancelled;
        emit ReservationCancelled(msg.sender, _reservationId);
    }

    // Pay for a reservation
    function payReservation(uint _reservationId) public payable onlyCustomer(_reservationId) {
        require(reservations[_reservationId].status == ReservationStatus.Pending, "Reservation is not pending");
        uint total = 0;
        for (uint i = 0; i < reservations[_reservationId].listItems.length; i++) {
            total += menuItems[reservations[_reservationId].listItems[i].id].price * reservations[_reservationId].listItems[i].quantity;
        }
        require(msg.value >= total, "Amount must be greater than total");
        payable(owner).transfer(total);
        payable(msg.sender).transfer(msg.value - total);

        for (uint i = 0; i < reservations[_reservationId].chairsReserved.length; i++) {
            tables[reservations[_reservationId].chairsReserved[i]] = false;
        }

        reservations[_reservationId].status = ReservationStatus.Paid;
        emit PaymentReceived(msg.sender, _reservationId, msg.value);
    }

    // Add Menu Item
    function addMenuItem(string memory _name, uint32 _price, bool _isAvailable, string memory _description) public onlyRestaurant {
        require(bytes(_name).length > 0, "Name must not be empty");
        require(_price > 0, "Price must be greater than 0");
        require(bytes(_description).length > 0, "Description must not be empty");
        counterMenuItems++;
        MenuItem storage menuItem = menuItems[counterMenuItems];
        menuItem.id = counterMenuItems;
        menuItem.name = _name;
        menuItem.price = _price;
        menuItem.isAvailable = _isAvailable;
        menuItem.description = _description;
        emit MenuItemAdded(menuItem.id, _name, _price, _isAvailable, _description);
    }

    // Add Table
    function addTable(uint32 _numberOfTables) public onlyRestaurant {
        require(_numberOfTables > 0, "Number of chairs must be greater than 0");
        counterTables += _numberOfTables;
        tables[counterTables] = false;
        emit TableAdded(counterTables);
    }

    // Change status of a reservation
    function changeStatusReservation(uint _reservationId, ReservationStatus _status)
    public onlyRestaurant validReservation(_reservationId) {
        reservations[_reservationId].status = _status;
        emit ReservationStatusChanged(msg.sender, _reservationId, _status);
    }

}
