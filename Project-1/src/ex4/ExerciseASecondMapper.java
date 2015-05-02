package ex4;

import java.io.IOException;
import java.util.Iterator;
import java.util.StringTokenizer;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.*;

public class Association2ndMapper extends Mapper<LongWritable, Text, Text, Text> {
	public static final Log LOG = LogFactory.getLog(Association2ndMapper.class);

	@Override
	public void map(LongWritable key, Text line,
			Context context)
			throws IOException, InterruptedException {
		// TODO Auto-generated method stub
		
		
		StringTokenizer st = new StringTokenizer(line.toString());
		String prodottoLeft = st.nextToken();
		String prodottoRight = st.nextToken();
		String quanto = st.nextToken();
		
		String out;
		if(prodottoLeft.equals(prodottoRight))
			out="total " + quanto;
		else
			out=prodottoRight + " " + quanto;
		//OG.info("MAPPER ROW OUT KEY =  " + prodottoLeft+ "; VALUE = " + out);
		context.write(new Text(prodottoLeft),new Text(out));
	 	
		}
		
		
	}


