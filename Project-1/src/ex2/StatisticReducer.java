package ex2;

import java.io.IOException;
import java.util.Iterator;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.Reducer;
import org.apache.hadoop.mapred.Reporter;

public class StatisticReducer extends MapReduceBase implements Reducer<Text, IntWritable, Text, DoubleWritable>{

	@Override
	public void reduce(Text arg0, Iterator<IntWritable> arg1,
			OutputCollector<Text, DoubleWritable> arg2, Reporter arg3)
			throws IOException {
		// TODO Auto-generated method stub
		
	}

}
