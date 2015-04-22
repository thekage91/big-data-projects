package ex2;

import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;
import java.util.Iterator;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.Reducer.Context;

public class SecondStepReducer extends
Reducer<Text, Text, Text, Text> {

	@Override
	public void reduce(Text key, Iterable<Text> values,
			Context context
			) throws IOException, InterruptedException {
		String toWrite = "";
		for( Text t : values)
			toWrite += t.toString() + " ";
		context.write(key, new Text(toWrite));

	}
}
