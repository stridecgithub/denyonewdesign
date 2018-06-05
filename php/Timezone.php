<?php

namespace App;
use DB;
use DateTime;
use DateTimeZone;
use DateInterval;
use Illuminate\Database\Eloquent\Model;

class Timezone extends Model
{
  
        function convertUTCtoDate($utc,$timezone_offset_minutes){        
            $timezonename=timezone_name_from_abbr("", $timezone_offset_minutes*60, false);
            $dt = new DateTime($utc, new DateTimeZone('UTC'));
            $dt->setTimezone(new DateTimeZone( $timezonename));
            $result=$dateString = $dt->format('D d/m/Y, h:i A');         
            return $result;
        }
        function convertUTCtoTime($utc,$timezone_offset_minutes){
                $timezonename=timezone_name_from_abbr("", $timezone_offset_minutes*60, false);
                $dt = new DateTime($utc, new DateTimeZone('UTC'));
                $dt->setTimezone(new DateTimeZone( $timezonename));
                $result=$dateString = $dt->format('h:i A');         
                return $result;
          }
        function getTimeZoneName($timezone_offset_minutes ){
                    $timezone_name = timezone_name_from_abbr("", $timezone_offset_minutes*60, false);
                    return $timezone_name;
            }      
        function convertUTCtoDateYMDHIS($utc,$timezone_offset_minutes){         
                $timezonename=timezone_name_from_abbr("", $timezone_offset_minutes*60, false);
                $dt = new DateTime($utc, new DateTimeZone('UTC'));
                $dt->setTimezone(new DateTimeZone( $timezonename));
                $result=$dateString = $dt->format('Y-m-d H:i:s');
                return $result;
        }
        function convertutctolocal($utc,$timezone_offset_minutes){
            $timezone_name = timezone_name_from_abbr("", $timezone_offset_minutes*60, false);
            $datetime = new DateTime($utc, new DateTimeZone($timezone_name));
            $datetime->setTimezone(new DateTimeZone( $timezone_name));
            $result=$dateString = $datetime->format('Y-m-d H:i:s');  
            return $result; 
        }
       


        function timeago($time, $tense='ago') {
                date_default_timezone_set('UTC');
                // declaring periods as static function var for future use
                static $periods = array('year', 'month', 'day', 'hour', 'minute', 'second');
            
                // checking time format
                if(!(strtotime($time)>0)) {
                    return trigger_error("Wrong time format: '$time'", E_USER_ERROR);
                }
            
                // getting diff between now and time
                $now  = new DateTime('now');
                $time = new DateTime($time);
                $diff = $now->diff($time)->format('%y %m %d %h %i %s');
                // combining diff with periods
                $diff = explode(' ', $diff);
                $diff = array_combine($periods, $diff);
                // filtering zero periods from diff
                $diff = array_filter($diff);
                // getting first period and value
                $period = key($diff);
                $value  = current($diff);
            
                // if input time was equal now, value will be 0, so checking it
                if(!$value) {
                    $period = 'seconds';
                    $value  = 0;
                } else {
                    // converting days to weeks
                    if($period=='day' && $value>=7) {
                        $period = 'week';
                        $value  = floor($value/7);
                    }
                    // adding 's' to period for human readability
                    if($value>1) {
                        $period .= 's';
                    }
                }
            
                // returning timeago
                return "$value $period $tense";
            }

                function duration($createdon) {
                        $result=0;
                        $cdate = date('Y-m-d H:i:s');					
                        $datediff = date("Y-m-d H:i:s", strtotime($createdon));
                        if($cdate == $datediff)
                        $timediff = 0;
                        else
                        $timediff = strtotime($cdate) - strtotime($datediff);

                        //MORE THAN 24 HOURS
                        if( $timediff > 86400 ) {
                                $result=1;					
                        }
                        return $result;
                }
}
