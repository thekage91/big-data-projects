import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.util.ToolRunner;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import ex2.*;
import ex4.*;


public class BillingJobs extends Configured implements Tool{
	public int run(String[] args) throws Exception {

		Configuration conf = getConf();
		Job job1 = Job.getInstance(conf, "Trimester Statistics 1 step");
		Job job2 = Job.getInstance(conf, "Trimester Statistics 2 step");
		Job job3 = Job.getInstance(conf, "Associative p1->p2 statistic 1 step");
		Job job4 = Job.getInstance(conf, "Associative p1->p2 statistic 2 step");

		
		job1.setJarByClass(BillingJobs.class);
		job1.setMapperClass(StatisticMapper.class);
		job1.setReducerClass(StatisticReducer.class);
		job1.setOutputKeyClass(Text.class);
		job1.setOutputValueClass(IntWritable.class);
		FileInputFormat.addInputPath(job1, new Path(args[0]));
		FileOutputFormat.setOutputPath(job1, new Path("temp"));
		

		job2.setMapperClass(SecondStepMapper.class);
		job2.setReducerClass(SecondStepReducer.class);
		job2.setOutputKeyClass(Text.class);
		job2.setOutputValueClass(Text.class);
		FileInputFormat.addInputPath(job2, new Path("temp"));
		FileOutputFormat.setOutputPath(job2,new Path(args[1]));
		
		job3.setMapperClass(Associationp1p2Mapper.class);
		job3.setReducerClass(Associationp1p2Reducer.class);
		job3.setOutputKeyClass(Text.class);
		job3.setOutputValueClass(IntWritable.class);
		FileInputFormat.addInputPath(job3, new Path(args[0]));
		FileOutputFormat.setOutputPath(job3,new Path("temp"));
		
		job4.setMapperClass(Association2ndMapper.class);
		job4.setReducerClass(Association2ndReducer.class);
		job4.setOutputKeyClass(Text.class);
		job4.setOutputValueClass(Text.class);
		FileInputFormat.addInputPath(job4, new Path("temp"));
		FileOutputFormat.setOutputPath(job4,new Path(args[1]));
		
		//job1.waitForCompletion(true);
		//job2.waitForCompletion(true);
		job3.waitForCompletion(true);
		job4.waitForCompletion(true);
		return 0;
		
		

	}

	public static void main(String[] args) throws Exception{
		int res = ToolRunner.run(new Configuration(), new BillingJobs(), args);
		System.exit(res);
	}
}
