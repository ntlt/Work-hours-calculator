<?php
if (isset($_POST['date']) && isset($_POST['start_time']) && isset($_POST['end_time'])) {
    $date = $_POST['date'];
    $start_time = $_POST['start_time'];
    $end_time = $_POST['end_time'];

    // Tính thời gian làm việc thực tế
    $total_time = strtotime($end_time) - strtotime($start_time);
    $lunch_time = strtotime('12:30') - strtotime('11:30');
    $working_time = $total_time