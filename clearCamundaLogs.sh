SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
echo $SCRIPTPATH
cd $SCRIPTPATH/../../../Downloads/camunda-bpm-tomcat-7.10.0/server/apache-tomcat-9.0.12/logs
LOGS_FOLDER=$(pwd)
echo $LOGS_FOLDER
ALLOW_FILE_SIZE=10

for logFile in $LOGS_FOLDER/*
do
  echo $logFile
  file_size=$(du -m $logFile | cut -f1)
  echo $file_size
  if [ $file_size -gt  $ALLOW_FILE_SIZE ]
    then
      echo ''>$logFile
  fi
done
