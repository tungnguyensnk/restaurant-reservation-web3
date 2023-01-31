// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract RestaurantReservations {
    uint32 private counterReservations;
    uint16 private counterReviews;
    uint32 private counterTables;
    uint32 private seaFoodPrice;
    address private owner;

    // Constructor
    constructor() {
        owner = msg.sender;
        role[msg.sender] = 2;
        counterReservations = 0;
        counterReviews = 0;
        counterTables = 0;
        seaFoodPrice = 2000;
        buffetPrice[BuffetPackage.Standard] = 10000;
        buffetPrice[BuffetPackage.Premium] = 20000;
        buffetPrice[BuffetPackage.Deluxe] = 30000;
    }

    // Events
    event ReservationAdded(address indexed customer, uint reservationId);
    event ReservationCancelled(address indexed customer, uint reservationId);
    event PaymentReceived(address indexed customer, uint reservationId, uint amount);
    event ReservationStatusChanged(address indexed customer, uint reservationId, ReservationStatus status);
    event ReviewAdded(address indexed customer, uint reviewId);
    event TableAdded(uint32 id);

    // Enums
    enum ReservationStatus {
        Pending,
        Deposited,
        Confirmed,
        Cancelled,
        Completed
    }

    enum BuffetPackage {
        Standard,
        Premium,
        Deluxe
    }

    // Structs

    struct Reservation {
        uint32 id;
        address customer;
        uint32 timestampReservation;
        uint32 timestampEat;
        uint16 numberOfPeople;
        uint8[] chairsReserved;
        BuffetPackage buffetPackage;
        bool useSeaFood;
        uint32 cost;
        ReservationStatus status;
        string specialRequest;
    }

    struct Review {
        uint16 id;
        uint32 reservationId;
        address customer;
        uint8 rating;
        string comment;
    }

    // Mapping
    mapping(BuffetPackage => uint32) public buffetPrice;
    mapping(address => uint) public points;
    mapping(uint32 => bool) public tables; // true = reserved, false = available
    mapping(uint => Reservation) public reservations;
    mapping(uint => Review) public reviews;
    mapping(address => uint) public role; // 0 = customer, 1 = restaurant, 2 = admin
    mapping(address => string) public name;
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

    modifier onlyCustomerOrRestaurant() {
        require(role[msg.sender] == 0 || role[msg.sender] == 1 || role[msg.sender] == 2, "Only customer, restaurant or admin can call this function");
        _;
    }

    modifier validTable(uint32 _tableId) {
        require(_tableId > 0 && _tableId <= counterTables, "Table id must be between 1 and number of tables");
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
    function getAllReservations(address _customer) public view returns (Reservation[] memory) {
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

    // Get name
    function getName() public view returns (string memory) {
        return name[msg.sender];
    }
    // Setters

    // Set name
    function setName(string memory _name) public {
        name[msg.sender] = _name;
    }
    // Functions

    // Add a reservation
    function addReservation(
        uint32 _timestampReservation,
        uint32 _timestampEat,
        uint16 _numberOfPeople,
        uint8[] memory _tablesReserved,
        BuffetPackage _buffetPackage,
        bool _useSeaFood,
        string memory _specialRequest
    ) public {
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
        uint32 price = buffetPrice[_buffetPackage];
        if (_useSeaFood) {
            price += seaFoodPrice;
        }

        counterReservations++;
        Reservation memory reservation = Reservation(
            counterReservations,
            msg.sender,
            _timestampReservation,
            _timestampEat,
            _numberOfPeople,
            _tablesReserved,
            _buffetPackage,
            _useSeaFood,
            price * _numberOfPeople,
            ReservationStatus.Pending,
            _specialRequest
        );
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

    // Deposit for a reservation
    function depositReservation(uint _reservationId) public payable onlyCustomer(_reservationId) {
        require(reservations[_reservationId].status == ReservationStatus.Pending, "Reservation is not pending");
        uint deposit = reservations[_reservationId].cost / 5;
        require(msg.value >= deposit, "Amount must be greater than deposit");
        payable(owner).transfer(deposit);
        payable(msg.sender).transfer(msg.value - deposit);
        reservations[_reservationId].status = ReservationStatus.Deposited;
        emit PaymentReceived(msg.sender, _reservationId, deposit);
    }
    // Pay for a reservation
    function payReservation(uint _reservationId) public payable onlyCustomer(_reservationId) {
        require(reservations[_reservationId].status == ReservationStatus.Confirmed, "Reservation is not confirmed");
        uint cost = reservations[_reservationId].cost * 4 / 5;
        require(msg.value >= cost, "Amount must be greater than cost");
        payable(owner).transfer(cost);
        payable(msg.sender).transfer(msg.value - cost);
        reservations[_reservationId].status = ReservationStatus.Completed;
        emit PaymentReceived(msg.sender, _reservationId, cost);
    }

    // Add Table
    function addTable(uint32 _numberOfTables) public onlyRestaurant returns (uint) {
        require(_numberOfTables > 0, "Number of chairs must be greater than 0");
        counterTables += _numberOfTables;
        tables[counterTables] = false;
        return counterTables;
    }

    // Change status of a table
    function changeStatusTable(uint32 _tableId, bool _isAvailable) public onlyRestaurant validTable(_tableId) {
        tables[_tableId] = _isAvailable;
    }

    // Change status of a reservation
    function changeStatusReservation(uint _reservationId, ReservationStatus _status)
    public onlyRestaurant validReservation(_reservationId) {
        reservations[_reservationId].status = _status;
    }

}
